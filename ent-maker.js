#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');
const directory = args.find(arg => !arg.startsWith('-')) || '.';

function findBspFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findBspFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.bsp')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Rename maps according to rules
function renameBspFiles(bspFiles) {
  const renamed = [];
  for (const file of bspFiles) {
    const dir = path.dirname(file);
    const base = path.basename(file, '.bsp');
    let newBase;

    if (/^e\d+m\d+/.test(base)) {
      newBase = base.replace(/^e/, 'qfm'); // eXmY -> qfmXmY
    } else {
      newBase = 'qfm' + base; // anything else -> qfmsomething
    }

    const newPath = path.join(dir, newBase + '.bsp');

    if (!dryRun && file !== newPath) {
      fs.renameSync(file, newPath);
    }

    renamed.push(newPath);
  }
  return renamed;
}

// Build mapping of original basename -> renamed basename
function buildOriginalToRenamedMap(originalFiles, renamedFiles) {
  const map = new Map();
  for (let i = 0; i < originalFiles.length; i++) {
    const origBase = path.basename(originalFiles[i], '.bsp');
    const newBase = path.basename(renamedFiles[i], '.bsp');
    map.set(origBase, newBase);
  }
  return map;
}

function findBestMatchForEnt(mapName, originalToRenamedMap) {
  const matches = Array.from(originalToRenamedMap.keys()).filter(k => k.startsWith(mapName));
  if (matches.length === 0) return null;
  const bestKey = matches.reduce((a, b) => (b.length > a.length ? b : a));
  return originalToRenamedMap.get(bestKey);
}

function copyToTempDir(bspFiles, tempDir) {
  const copied = [];
  for (const src of bspFiles) {
    const dest = path.join(tempDir, path.basename(src));
    fs.copyFileSync(src, dest);
    copied.push(dest);
  }
  return copied;
}

function extractEntitiesAndPatchMapLines(bspFilePath, originalToRenamedMap) {
  const entFilePath = bspFilePath.replace(/\.bsp$/i, '.ent');
  console.log(`Processing: ${path.basename(bspFilePath)}`);

  try {
    execSync(`bsputil --extract-entities "${bspFilePath}"`);
  } catch (err) {
    console.error(`  ✖ Failed to extract: ${err.message}`);
    return;
  }

  if (!fs.existsSync(entFilePath)) {
    console.warn(`  ⚠ No .ent file generated.`);
    return;
  }

  const originalLines = fs.readFileSync(entFilePath, 'utf8').split(/\r?\n/);
  const updatedLines = originalLines.map(line => {
    const mapMatch = line.match(/^\s*"map"\s*"([^"]+)"\s*$/);
    if (mapMatch) {
      const originalMapValue = mapMatch[1];
      const bestMatch = findBestMatchForEnt(originalMapValue, originalToRenamedMap);
      if (bestMatch && bestMatch !== originalMapValue) {
        console.log(`  ↪ "map" "${originalMapValue}" → "${bestMatch}"`);
        return line.replace(/"map"\s*"[^"]+"/, `"map" "${bestMatch}"`);
      } else {
        console.warn(`  ⚠ No extended match for map "${originalMapValue}"`);
      }
    }
    return line;
  });

  fs.writeFileSync(entFilePath, updatedLines.join('\n'), 'utf8');

  if (!dryRun) {
    try {
      execSync(`bsputil --replace-entities "${entFilePath}" "${bspFilePath}"`);
      fs.unlinkSync(entFilePath);
      console.log(`  ✔ Entities replaced and .ent deleted`);
    } catch (err) {
      console.error(`  ✖ Failed to replace entities: ${err.message}`);
    }
  } else {
    console.log(`  [Dry Run] Would replace entities and delete .ent`);
  }
}

function deleteFolderRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath)) {
    const curPath = path.join(dirPath, entry);
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteFolderRecursive(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  }
  fs.rmdirSync(dirPath);
}

// === MAIN ===
let originalBspFiles = findBspFiles(directory);
if (originalBspFiles.length === 0) {
  console.log('No .bsp files found.');
  process.exit(0);
}

let workingBspFiles = originalBspFiles;
let tempDir = null;

// Dry run: copy to temp dir
if (dryRun) {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bsp-dryrun-'));
  workingBspFiles = copyToTempDir(originalBspFiles, tempDir);
  console.log(`[Dry Run] Processing files in temporary memory — original files remain untouched.\n`);
}

// Rename maps
if (dryRun) {
  console.log(`[Dry Run] Simulating renames of .bsp files to 'qfm...' format`);
} else {
  workingBspFiles = renameBspFiles(workingBspFiles);
}

// Build mapping for .ent substitutions
const originalToRenamedMap = buildOriginalToRenamedMap(originalBspFiles, workingBspFiles);

// Process .ent files and replace entities in BSP
for (const bsp of workingBspFiles) {
  extractEntitiesAndPatchMapLines(bsp, originalToRenamedMap);
}

if (dryRun && tempDir) {
  deleteFolderRecursive(tempDir);
  console.log(`\n[Dry Run Complete] Temporary files removed. No files were modified.`);
}

