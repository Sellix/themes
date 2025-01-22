#!/bin/sh

for dir in ../themes/*; do
  if [ -d "$dir" ]; then
    echo "Compressing: $dir"

    theme_name=$(basename "$dir")
    version=$(jq -r ".version" "$dir/theme.json")
    echo "Theme and Version: $theme_name:$version"

    mkdir -p ./output/$theme_name
    archive_name="./output/$theme_name/$version.zip"

    cd $dir
    zip -qr "../../scripts/$archive_name" *
    cd ../../scripts


    echo "Theme $theme compressed to $archive_name"
  fi
done
