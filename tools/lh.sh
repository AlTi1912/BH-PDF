SPKI=$(cat spki.txt); export CHROME_PATH=/opt/pw-browsers/chromium
O=https://www.blackhawkcaraudio.com; N=https://obj-sociology-humidity-delhi.trycloudflare.com
for run in 1 2 3; do for ff in mobile desktop; do for pg in "home|/|/" "cat|/product-category/subwoofer/|/product-category/subwoofer/" "prod|/product/bh-sw12xxg/|/product/bh-sw12xxg/"; do
 IFS='|' read name po pn <<< "$pg"
 for v in A N; do if [ $v = A ]; then u=$O$po; else u=$N$pn; fi
  preset=""; [ $ff = desktop ] && preset="--preset=desktop"
  out=../evidence/lighthouse/$v-$name-$ff-r$run.json
  npx lighthouse "$u" $preset --quiet --output=json --output-path=$out --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new --no-sandbox --ignore-certificate-errors-spki-list=$SPKI" >/dev/null 2>&1 || echo "FAIL $out"
  echo "done $out $(date +%T)"
 done; done; done; done
echo LHDONE
