const L = require('./lib'); (async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await L.goto(p, process.argv[2]); await L.settle(p);
const r = await p.evaluate(() => { const out = { sticky: [], hidden: [], tall: [] };
 for (const e of document.querySelectorAll('body *')) { const cs = getComputedStyle(e); const rc = e.getBoundingClientRect();
  if (cs.position === 'sticky') out.sticky.push(e.tagName + '.' + e.className.toString().slice(0, 60) + ' top=' + Math.round(rc.top + scrollY) + ' h=' + Math.round(rc.height) + ' parentH=' + Math.round(e.parentElement.getBoundingClientRect().height));
  if (cs.opacity === '0' && rc.height > 100) out.hidden.push(e.tagName + '.' + e.className.toString().slice(0, 60) + ' y=' + Math.round(rc.top + scrollY)); }
 return out; }); console.log(JSON.stringify(r, null, 1)); await b.close(); })();
