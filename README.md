# Themes

This repo will be used to version the theme releases as well as allow for multiple features to be worked on and released at the same time by different developers.

The import feature on the website can be used to test different themes at once before deploying them officially for every store.

## Deployment process

This process is for Sellix developers, some links might not be working for the general public.

1. *[if needed]* build [shop-widgets](https://github.com/sellix/shop-widgets). for invoice.js and purchase.js

2. *[if needed]* update theme directory to add the new two .js files

3. update the theme adding the new JS and CSS files

4. use script `bash scripts/zip.sh {themeName} {version}`, e.g. `bash scripts/zip.sh default 0.0.24`; the script will create a .zip file in `output/{version}.zip`

5. add a tag to this repo and push

```git
git add --all
git commit -m "version v0.0.24"
git push
git tag v0.0.24
git push --tags
```

6. add `output/{version}.zip` to the api directory `themes/{version}.zip`

7. deploy api