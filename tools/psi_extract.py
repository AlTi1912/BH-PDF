import json,re,sys
out={}
for ff in ('mobile','desktop'):
    h=open(f'psi-{ff}.html').read()
    lrs=[]
    for m in re.finditer(r'"(\{\\n  \\"fetchTime\\")',h):
        # decode JS string literal starting at m.start()
        s=m.start(); j=s+1; esc=False
        while True:
            c=h[j]
            if esc: esc=False
            elif c=='\\': esc=True
            elif c=='"': break
            j+=1
        lrs.append(json.loads(json.loads(h[s:j+1])))
    print(ff, 'reports', len(lrs), [ (l['configSettings']['formFactor'], l['fetchTime']) for l in lrs])
    for l in lrs:
        a=l['audits']; c=l['categories']
        d=dict(ff=l['configSettings']['formFactor'], fetch=l['fetchTime'], lh=l['lighthouseVersion'], url=l['finalUrl'],
          scores={k:round(v['score']*100) for k,v in c.items()},
          fcp=a['first-contentful-paint']['displayValue'], lcp=a['largest-contentful-paint']['displayValue'], tbt=a['total-blocking-time']['displayValue'],
          cls=a['cumulative-layout-shift']['displayValue'], si=a['speed-index']['displayValue'],
          bytes=round(a['total-byte-weight']['numericValue']/1024), reqs=len(a['network-requests']['details']['items']))
        out[d['ff']]=d; print(json.dumps(d,ensure_ascii=False))
        json.dump(l,open(f'../evidence/pagespeed/psi-antes-{d["ff"]}-lighthouse.json','w'))
json.dump(out,open('../evidence/pagespeed/psi-antes-resumen.json','w'),indent=1,ensure_ascii=False)
