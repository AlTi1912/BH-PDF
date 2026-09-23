// node stitch.js id url d|m  -> frames + meta, then python stitches
const L = require('./lib'); const fs = require('fs'); const [,, id, url, vpn] = process.argv;
const VP = vpn === 'd' ? { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
(async () => { const b = await L.launch(); const ctx = await b.newContext({ ...VP, locale: 'es-PE' }); const p = await ctx.newPage();
 const r = await L.goto(p, url); await L.settle(p); const vh = VP.viewport.height; const dir = `frames/${id}`; fs.mkdirSync(dir, { recursive: true });
 const H = await p.evaluate(() => document.documentElement.scrollHeight); const frames = []; let end = 0, target = 0, k = 0;
 while (end < H && k < 60) { await p.evaluate(y => window.scrollTo(0, y), target); await p.waitForTimeout(900);
  const m = await p.evaluate(() => { let hb = 0; for (const e of document.querySelectorAll('body *')) { const cs = getComputedStyle(e); if ((cs.position === 'fixed' || cs.position === 'sticky') && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.05) { const r = e.getBoundingClientRect(); if (r.top <= 1 && r.height > 20 && r.height < 200 && r.width > innerWidth * 0.8) hb = Math.max(hb, r.bottom); } } return { sy: Math.round(scrollY), hb: Math.round(hb), H: document.documentElement.scrollHeight }; });
  const f = `${dir}/${String(k).padStart(2, '0')}.png`; await p.screenshot({ path: f });
  const from = k === 0 ? 0 : Math.max(end, m.sy + m.hb); const to = Math.min(m.sy + vh, m.H);
  if (to > from) frames.push({ f, sy: m.sy, from, to }); end = Math.max(end, to);
  target = end - m.hb - 0; if (m.sy + vh >= m.H) break; k++; }
 fs.writeFileSync(`${dir}/meta.json`, JSON.stringify({ id, url, vp: VP.viewport, dpr: VP.deviceScaleFactor, http: r && r.status(), date: new Date().toISOString(), frames }, null, 1)); console.log(id, 'frames', frames.length, 'H', H); await b.close(); })();
