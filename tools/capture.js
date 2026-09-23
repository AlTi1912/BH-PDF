// usage: node capture.js jobs.json  -> each job {id, v:'antes'|'ahora', url, vp:'d'|'m', name, full:true, clip?}
const L = require('./lib'); const fs = require('fs');
const VP = { d: { width: 1440, height: 900 }, m: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const EV = __dirname + '/../evidence/evidence.json';
(async () => { const jobs = JSON.parse(fs.readFileSync(process.argv[2])); const ev = fs.existsSync(EV) ? JSON.parse(fs.readFileSync(EV)) : [];
  const b = await L.launch();
  for (const j of jobs) { const vp = VP[j.vp]; const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1, locale: 'es-PE', reducedMotion: 'no-preference' });
    const p = await ctx.newPage(); const rec = { id: j.id, version: j.v, url: j.url, viewport: `${vp.width}x${vp.height}`, date: new Date().toISOString(), files: [] };
    try { const r = await L.goto(p, j.url); rec.http = r && r.status(); await L.settle(p); rec.finalUrl = p.url(); rec.title = await p.title();
      const base = `../evidence/screens/${j.id}`;
      await p.screenshot({ path: base + '-view.png' }); rec.files.push(`screens/${j.id}-view.png`);
      if (j.full !== false) { await p.screenshot({ path: base + '-full.png', fullPage: true }); rec.files.push(`screens/${j.id}-full.png`); }
      rec.height = await p.evaluate(() => document.documentElement.scrollHeight);
      rec.hscroll = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    } catch (e) { rec.error = String(e.message).slice(0, 200); }
    console.log(JSON.stringify(rec)); const i = ev.findIndex(x => x.id === j.id); if (i >= 0) ev[i] = rec; else ev.push(rec); fs.writeFileSync(EV, JSON.stringify(ev, null, 1)); await ctx.close(); }
  await b.close(); })();
