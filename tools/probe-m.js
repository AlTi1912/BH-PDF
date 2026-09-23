const L = require('./lib'); (async () => { const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await ctx.newPage();
await L.goto(p, process.argv[2]); await L.settle(p);
const r = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const cs = getComputedStyle(e); return (cs.opacity === '0' || cs.visibility === 'hidden') && e.getBoundingClientRect().height > 80; }).map(e => e.className.toString().slice(0, 70) + ' y=' + Math.round(e.getBoundingClientRect().top + scrollY) + ' h=' + Math.round(e.getBoundingClientRect().height)));
console.log(r.join('\n'));
for (const y of [3000, 4000, 4600, 5200]) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(1500); await p.screenshot({ path: `/tmp/claude-0/-home-user-BH-PDF/a935ba5a-f42f-54c2-beab-f1f4b22356e2/scratchpad/m${y}.png` }); }
await b.close(); })();
