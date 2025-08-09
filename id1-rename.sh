#!/bin/bash
for file in *.*; do
  # Skip if no underscore in basename
  if [[ "$file" == *_*.* ]]; then
    ext="${file##*.}"
    base="${file%.*}"
    name="${base%_*}"

    # Check if name starts with e followed by a digit
    if [[ "$name" =~ ^e([0-9]+)m([0-9]+) ]]; then
      # Extract X and Y from the pattern eXmY
      X="${BASH_REMATCH[1]}"
      Y="${BASH_REMATCH[2]}"
      # Construct name as eXmY only, cutting off anything after Y
      name="e${X}m${Y}"
    fi

    mv "$file" "${name}.${ext}"
  fi
done
