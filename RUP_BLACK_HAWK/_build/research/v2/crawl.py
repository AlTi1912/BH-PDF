import re, html, json, subprocess
from concurrent.futures import ThreadPoolExecutor
urls=[l.strip() for l in open('wp-sitemap-posts-product-1.txt') if l.strip()]
def get(u):
    s=subprocess.run(['curl','-s','--max-time','60',u],capture_output=True,text=True).stdout
    m=re.search(r'Información del producto(.*?)(También podría|Sigue explorando)',s,re.S)
    blk=m.group(1) if m else ''
    spec=re.search(r'Especificaciones(.*?)(Descripción|$)',blk,re.S)
    sp=spec.group(1) if spec else ''
    cat=re.search(r'Categoría\s*</[^>]+>\s*<[^>]+>\s*([^<]+)',blk)
    return {'u':u.rstrip('/').split('/')[-1],'verif':'verificadas por Black Hawk' in s,'bloque':bool(m),'li':len(re.findall(r'<li',sp)),'p':len(re.findall(r'<p',sp)),'spec_txt':len(re.sub(r'<[^>]+>','',sp).strip()),'proximamente':'Próximamente' in s or 'PRÓXIMAMENTE' in s}
with ThreadPoolExecutor(6) as ex: res=list(ex.map(get,urls))
json.dump(res,open('fichas.json','w'),indent=1)
print('total',len(res),'con bloque',sum(r['bloque'] for r in res),'sello verificado',sum(r['verif'] for r in res))
print('specs en lista',sum(1 for r in res if r['li']>0),'solo parrafo',sum(1 for r in res if r['li']==0 and r['p']>0),'sin specs',sum(1 for r in res if r['spec_txt']<5))
print('sin specs:',[r['u'] for r in res if r['spec_txt']<5][:20])
print('parrafo:',[r['u'] for r in res if r['li']==0 and r['p']>0][:20])
print('proximamente',[r['u'] for r in res if r['proximamente']][:20])
