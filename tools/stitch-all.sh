set -u
run(){ node stitch.js "$1" "$2" "$3" || node stitch.js "$1" "$2" "$3"; python3 stitch.py frames/$1; }
for v in d m; do
run A-home-$v https://www.blackhawkcaraudio.com/ $v; run N-home-$v https://obj-sociology-humidity-delhi.trycloudflare.com/ $v
run A-shop-$v https://www.blackhawkcaraudio.com/shop/ $v; run N-shop-$v https://obj-sociology-humidity-delhi.trycloudflare.com/shop/ $v
run A-cat-sub-$v https://www.blackhawkcaraudio.com/product-category/subwoofer/ $v; run N-cat-sub-$v https://obj-sociology-humidity-delhi.trycloudflare.com/product-category/subwoofer/ $v
run A-prod-sw12xxg-$v https://www.blackhawkcaraudio.com/product/bh-sw12xxg/ $v; run N-prod-sw12xxg-$v https://obj-sociology-humidity-delhi.trycloudflare.com/product/bh-sw12xxg/ $v
run A-prod-812dsp-$v https://www.blackhawkcaraudio.com/product/bh-8-12dsp/ $v; run N-prod-812dsp-$v https://obj-sociology-humidity-delhi.trycloudflare.com/product/bh-8-12dsp/ $v
run A-gal-$v https://www.blackhawkcaraudio.com/galeria-de-fotos/ $v; run N-gal-$v https://obj-sociology-humidity-delhi.trycloudflare.com/galeria/ $v
run A-mayor-$v https://www.blackhawkcaraudio.com/ventas-al-mayor/ $v; run N-mayor-$v https://obj-sociology-humidity-delhi.trycloudflare.com/mayoristas/ $v
run N-distri-$v https://obj-sociology-humidity-delhi.trycloudflare.com/distribuidores/ $v; run N-nosotros-$v https://obj-sociology-humidity-delhi.trycloudflare.com/nosotros/ $v; run N-soporte-$v https://obj-sociology-humidity-delhi.trycloudflare.com/soporte/ $v; run N-privacidad-$v https://obj-sociology-humidity-delhi.trycloudflare.com/politica-de-privacidad/ $v
done
echo ALLDONE
