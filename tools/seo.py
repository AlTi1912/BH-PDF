import re,json,urllib.request,ssl,html
from html.parser import HTMLParser
O='https://www.blackhawkcaraudio.com'; N='https://obj-sociology-humidity-delhi.trycloudflare.com'
pages=[('home','/','/'),('catalogo','/shop/','/shop/'),('categoria','/product-category/subwoofer/','/product-category/subwoofer/'),('producto','/product/bh-sw12xxg/','/product/bh-sw12xxg/'),('galeria','/galeria-de-fotos/','/galeria/'),('mayoristas','/ventas-al-mayor/','/mayoristas/')]
class P(HTMLParser):
    def __init__(s): super().__init__(); s.d={'h':[],'img':0,'img_noalt':0,'img_emptyalt':0,'og':{},'ld':[],'lang':None,'title':'','desc':None,'canon':None,'robots':None,'landmarks':set(),'links_int':set()}; s.cur=None; s.buf=''; s.inld=False
    def handle_starttag(s,t,a):
        a=dict(a)
        if t=='html': s.d['lang']=a.get('lang')
        if t in('h1','h2','h3'): s.cur=t; s.buf=''
        if t=='title': s.cur='title'; s.buf=''
        if t=='img':
            s.d['img']+=1
            if 'alt' not in a: s.d['img_noalt']+=1
            elif not a['alt'].strip(): s.d['img_emptyalt']+=1
        if t=='meta':
            n=(a.get('name') or a.get('property') or '').lower()
            if n=='description': s.d['desc']=a.get('content')
            if n=='robots': s.d['robots']=a.get('content')
            if n.startswith('og:'): s.d['og'][n]=a.get('content','')[:90]
        if t=='link' and a.get('rel')=='canonical': s.d['canon']=a.get('href')
        if t=='script' and a.get('type')=='application/ld+json': s.inld=True; s.buf=''
        if t in('header','nav','main','footer'): s.d['landmarks'].add(t)
    def handle_endtag(s,t):
        if s.cur and t==s.cur:
            txt=re.sub(r'\s+',' ',s.buf).strip()
            if t=='title': s.d['title']=txt
            else: s.d['h'].append(t.upper()+': '+txt[:70])
            s.cur=None
        if t=='script' and s.inld:
            try:
                j=json.loads(s.buf); g=j.get('@graph',[j]) if isinstance(j,dict) else j
                s.d['ld']+= [x.get('@type') for x in g if isinstance(x,dict)]
            except Exception as e: s.d['ld'].append('ERR')
            s.inld=False
    def handle_data(s,x):
        if s.cur or s.inld: s.buf+=x
out={}
for key,po,pn in pages:
    for ver,base,path in (('antes',O,po),('ahora',N,pn)):
        raw=urllib.request.urlopen(urllib.request.Request(base+path,headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/141 Safari/537.36'}),timeout=60).read().decode('utf8','replace')
        p=P(); p.feed(raw); d=p.d; d['landmarks']=sorted(d['landmarks']); d['bytes_html']=len(raw.encode())
        d['h1']=[h for h in d['h'] if h.startswith('H1')]; d['nh2']=sum(h.startswith('H2') for h in d['h']); d['nh3']=sum(h.startswith('H3') for h in d['h'])
        del d['links_int']; d['h']=d['h'][:14]
        out[f'{key}|{ver}']=d
json.dump(out,open('../evidence/data/seo.json','w'),ensure_ascii=False,indent=1)
for k,d in out.items(): print(k,'|',d['title'],'| desc:',(d['desc'] or 'NONE')[:60],'| canon:',bool(d['canon']),'| robots:',d['robots'],'| H1:',d['h1'],'| h2/h3',d['nh2'],d['nh3'],'| img',d['img'],'noalt',d['img_noalt'],'emptyalt',d['img_emptyalt'],'| og',len(d['og']),'| ld',d['ld'],'| lang',d['lang'],'| lm',d['landmarks'])
