import json,sys
from PIL import Image
for d in sys.argv[1:]:
    m=json.load(open(d+'/meta.json')); s=m['dpr']; W=m['vp']['width']*s
    tot=sum(f['to']-f['from'] for f in m['frames'])
    out=Image.new('RGB',(W,tot*s),'white'); y=0
    for f in m['frames']:
        im=Image.open(f['f']); top=(f['from']-f['sy'])*s; h=(f['to']-f['from'])*s
        out.paste(im.crop((0,top,W,top+h)),(0,y)); y+=h
    o='../evidence/screens/'+m['id']+'-stitch.png'; out.save(o,optimize=True); print(o,out.size)
