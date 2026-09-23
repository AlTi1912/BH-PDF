// QA del informe: errores, recursos, overflow, capturas por sección, PDF
const { chromium } = require('/opt/node22/lib/node_modules/playwright'); const fs = require('fs'); const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const URL = 'file://' + ROOT + '/black-hawk-evolucion-web.html'; const OUT = process.argv[2] || '/tmp/qa';
fs.mkdirSync(OUT, { recursive: true });
(async () => { const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
 for (const [name, vp] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }], ['t', { width: 820, height: 1180 }]]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 1 }); const errs = []; p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); }); p.on('requestfailed', r => errs.push('failed ' + r.url()));
  await p.goto(URL, { waitUntil: 'load' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); }); await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')), wide: [...document.querySelectorAll('main *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && !e.closest('.tbl-wrap,.scroller,.ba__stage') && getComputedStyle(e).position !== 'fixed'; }).map(e => e.tagName + '.' + e.className).slice(0, 8), secs: [...document.querySelectorAll('main > section')].length }));
  console.log(name, JSON.stringify(r), errs.slice(0, 8));
  const secs = await p.$$('main > section'); for (let i = 0; i < secs.length; i++) { await secs[i].screenshot({ path: `${OUT}/${name}-${String(i).padStart(2, '0')}.png` }); }
  await p.close(); }
 const p = await b.newPage(); await p.goto(URL, { waitUntil: 'load' }); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } }); await p.waitForTimeout(500);
 await p.emulateMedia({ media: 'print' });
 await p.pdf({ path: ROOT + '/black-hawk-evolucion-web.pdf', preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
 console.log('pdf ok'); await b.close(); })();
