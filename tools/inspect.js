const L = require('./lib'); const url = process.argv[2]; const vw = process.argv[3] || '1440x900';
(async () => { const [w, h] = vw.split('x').map(Number); const b = await L.launch(); const p = await b.newPage({ viewport: { width: w, height: h } });
  const r = await L.goto(p, url); await L.settle(p);
  const d = await p.evaluate(() => { const q = s => [...document.querySelectorAll(s)]; const t = e => (e.innerText || e.value || e.getAttribute('aria-label') || e.title || '').trim().replace(/\s+/g, ' ').slice(0, 80);
    return { url: location.href, title: document.title, desc: document.querySelector('meta[name=description]')?.content, canonical: document.querySelector('link[rel=canonical]')?.href, robots: document.querySelector('meta[name=robots]')?.content,
      h: q('h1,h2,h3').map(e => e.tagName + ': ' + t(e)).slice(0, 60), forms: q('form').map(f => (f.action || '') + ' [' + q.call ? [...f.querySelectorAll('input,select,button')].map(i => (i.name || i.type) + '=' + t(i)).join(', ') + ']' : ''),
      buttons: [...new Set(q('button,[role=button]').map(t).filter(Boolean))].slice(0, 80), height: document.documentElement.scrollHeight, imgs: q('img').length, noalt: q('img:not([alt]),img[alt=""]').length,
      jsonld: q('script[type="application/ld+json"]').map(s => { try { const j = JSON.parse(s.textContent); return JSON.stringify(j).slice(0, 300); } catch { return 'ERR'; } }) }; });
  console.log('HTTP', r && r.status()); console.log(JSON.stringify(d, null, 1)); await b.close(); })();
