#!/bin/sh

die () {
  echo >&2 "$@"
  exit 1
}

[ "$#" -eq 2 ] || die "usage: zip.sh themeName outputVersion"

echo $1 | grep -E -q '^[a-zA-Z0-9_.-]*$' || die "String argument required, $1 provided; not matching regex"
echo $2 | grep -E -q '^[a-zA-Z0-9_.-]*$' || die "String argument required, $2 provided; not matching regex"

[ -d "themes/$1" ] || die "Theme $1 does not exist"

cd themes/$1
zip -r ../../output/$2.zip *
cd ../..