const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const directory = process.argv[2] || '.';

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

// Instead of Map, just collect all .bsp base names
function buildPrefixLookup(bspFiles) {
  return bspFiles.map(f => path.basename(f, '.bsp'));
}

function findBestMatch(mapName, fullNames) {
  const matches = fullNames.filter(name => name.startsWith(mapName));
  if (matches.length === 0) return null;
  return matches.reduce((a, b) => (b.length > a.length ? b : a));
}

function extractEntitiesAndPatchMapLines(bspFilePath, fullNames) {
  const entFilePath = bspFilePath.replace(/\.bsp$/i, '.ent');

  console.log(`Processing: ${bspFilePath}`);

  try {
    execSync(`bsputil --extract-entities "${bspFilePath}"`);
  } catch (err) {
    console.error(`Failed to extract entities from ${bspFilePath}:`, err.message);
    return;
  }

  if (!fs.existsSync(entFilePath)) {
    console.warn(`.ent file not found for ${bspFilePath}`);
    return;
  }

  const originalLines = fs.readFileSync(entFilePath, 'utf8').split(/\r?\n/);
  const updatedLines = originalLines.map(line => {
    const mapMatch = line.match(/^\s*"map"\s*"([^"]+)"\s*$/);
    if (mapMatch) {
      const originalMapValue = mapMatch[1]; // e.g. "e3m7"
      const bestMatch = findBestMatch(originalMapValue, fullNames);
      if (bestMatch && bestMatch !== originalMapValue) {
        console.log(`  ↪ Replacing map "${originalMapValue}" → "${bestMatch}"`);
        return line.replace(/"map"\s*"[^"]+"/, `"map" "${bestMatch}"`);
      } else {
        console.warn(`  ⚠ No extended match for map "${originalMapValue}"`);
      }
    }
    return line;
  });

  fs.writeFileSync(entFilePath, updatedLines.join('\n'), 'utf8');
  console.log(`Updated: ${entFilePath}`);
}

// === MAIN ===
const bspFiles = findBspFiles(directory);
if (bspFiles.length === 0) {
  console.log('No .bsp files found.');
  process.exit(0);
}

const fullNames = buildPrefixLookup(bspFiles);

for (const bsp of bspFiles) {
  extractEntitiesAndPatchMapLines(bsp, fullNames);
}
