# Themes

## Deployment process

1. *[if needed]* build shop-widgets for invoice.js and purchase.js

2. *[if needed]* update theme directory to add the new two .js files

3. update the theme adding the new JS and CSS files

4. use script `bash scripts/zip.sh {themeName} {version}`, e.g. `bash scripts/zip.sh default 0.0.24`

5. add a tag to this repo and push

```git
git add --all
git commit -m "version v0.0.24"
git push
git tag v0.0.24
git push --tags
```

6. add to api `themes/{version}.zip`

7. deploy api