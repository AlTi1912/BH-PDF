// QA de la presentación ejecutiva: errores, overflow, capturas y PDF
const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const URL = 'file://' + ROOT + '/black-hawk-evolucion-ejecutiva.html'; const OUT = process.argv[2] || '/tmp/qa-exec'; fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
 for (const [name, vp] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('requestfailed', r => errs.push('failed ' + r.url()));
  await p.goto(URL, { waitUntil: 'load' }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth, broken: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')),
    clipped: [...document.querySelectorAll('.s')].map((s, i) => { const sr = s.getBoundingClientRect(); const bad = [...s.querySelectorAll('h1,h2,p,li,span,b,figcaption,img')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.bottom > sr.bottom + 1 || r.right > sr.right + 1); }).map(e => e.tagName + ':' + (e.textContent || e.getAttribute('src') || '').trim().slice(0, 30)); return bad.length ? (i + 1) + ' ' + bad.slice(0, 4).join(' | ') : null; }).filter(Boolean) }));
  console.log(name, JSON.stringify(r), errs);
  const ss = await p.$$('.s'); for (let i = 0; i < ss.length; i++) await ss[i].screenshot({ path: `${OUT}/${name}-${String(i + 1).padStart(2, '0')}.png` });
  await p.close(); }
 const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.goto(URL, { waitUntil: 'load' }); await p.emulateMedia({ media: 'print' }); await p.waitForTimeout(500);
 const pr = await p.evaluate(() => [...document.querySelectorAll('.s')].map((s, i) => { const sr = s.getBoundingClientRect(); const bad = [...s.querySelectorAll('h1,h2,p,li,span,b,figcaption,img,.shot')].filter(e => { const r = e.getBoundingClientRect(); return r.width && (r.bottom > sr.bottom + 1 || r.right > sr.right + 1); }).map(e => e.tagName + ':' + (e.textContent || '').trim().slice(0, 30)); return bad.length ? (i + 1) + ' ' + bad.slice(0, 4).join(' | ') : null; }).filter(Boolean));
 console.log('print overflow', pr);
 await p.pdf({ path: ROOT + '/black-hawk-evolucion-ejecutiva.pdf', preferCSSPageSize: true, printBackground: true, tagged: true });
 console.log('pdf ok'); await b.close(); })();
