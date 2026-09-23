const L = require('./lib'); (async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await L.goto(p, process.argv[2]); await L.settle(p); const y = +process.argv[3];
await p.evaluate(y => window.scrollTo(0, y - 300), y); await p.waitForTimeout(2500);
const r = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().height > 100).map(e => e.className.toString().slice(0, 80) + ' y=' + Math.round(e.getBoundingClientRect().top + scrollY) + ' anim=' + getComputedStyle(e).transition.slice(0, 60)));
console.log(r); await p.screenshot({ path: '/tmp/claude-0/-home-user-BH-PDF/a935ba5a-f42f-54c2-beab-f1f4b22356e2/scratchpad/probe.png' }); await b.close(); })();
