import json,glob,gzip,statistics as st,os,re
rows={}
for f in sorted(glob.glob('../evidence/lighthouse/*.json.gz')):
    v,pg,ff,r=re.match(r'.*/([AN])-(\w+)-(mobile|desktop)-r(\d)\.json\.gz',f).groups()
    j=json.load(gzip.open(f))
    if j.get('runtimeError'): print('RTERR',f,j['runtimeError']); continue
    a=j['audits']; c=j['categories']
    reqs=a['network-requests']['details']['items']
    d=dict(perf=c['performance']['score']*100, a11y=c['accessibility']['score']*100, bp=c['best-practices']['score']*100, seo=c['seo']['score']*100,
      fcp=a['first-contentful-paint']['numericValue'], lcp=a['largest-contentful-paint']['numericValue'], tbt=a['total-blocking-time']['numericValue'],
      cls=a['cumulative-layout-shift']['numericValue'], si=a['speed-index']['numericValue'], ttfb=a['server-response-time']['numericValue'],
      bytes=a['total-byte-weight']['numericValue'], nreq=len(reqs), when=j['fetchTime'], ua=j['environment']['hostUserAgent'][:0], url=j['finalDisplayedUrl'] if 'finalDisplayedUrl' in j else j['finalUrl'],
      thr=j['configSettings']['throttling'], method=j['configSettings']['throttlingMethod'])
    rows.setdefault((pg,ff,v),[]).append(d)
out={}
for k,ds in sorted(rows.items()):
    m={x:st.median([d[x] for d in ds]) for x in ['perf','a11y','bp','seo','fcp','lcp','tbt','cls','si','ttfb','bytes','nreq']}
    m['runs']=len(ds); m['range_perf']=(min(d['perf'] for d in ds),max(d['perf'] for d in ds)); m['range_lcp']=(min(d['lcp'] for d in ds),max(d['lcp'] for d in ds))
    m['url']=ds[0]['url']; m['times']=[d['when'] for d in ds]
    out['|'.join(k)]=m
    print('|'.join(k), 'n=%d perf=%d(%d-%d) a11y=%d bp=%d seo=%d FCP=%.1fs LCP=%.1fs(%.1f-%.1f) TBT=%dms CLS=%.3f SI=%.1fs TTFB=%dms KB=%d req=%d'%(len(ds),m['perf'],*m['range_perf'],m['a11y'],m['bp'],m['seo'],m['fcp']/1000,m['lcp']/1000,m['range_lcp'][0]/1000,m['range_lcp'][1]/1000,m['tbt'],m['cls'],m['si']/1000,m['ttfb'],m['bytes']/1024,m['nreq']))
json.dump(out,open('../evidence/data/lighthouse-medianas.json','w'),indent=1)
j=json.load(gzip.open('../evidence/lighthouse/A-home-mobile-r1.json.gz')); print(j['configSettings']['throttling'], j['configSettings']['screenEmulation'])
j=json.load(gzip.open('../evidence/lighthouse/A-home-desktop-r1.json.gz')); print(j['configSettings']['throttling'], j['configSettings']['screenEmulation'])
