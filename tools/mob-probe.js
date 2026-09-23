const L = require('./lib');
(async () => { const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await ctx.newPage();
 for (const u of [L.O + '/', L.N + '/']) { await L.goto(p, u); await L.settle(p);
  const r = await p.evaluate(() => [...document.querySelectorAll('button, a, [role=button], .menu-toggle, [class*=toggle], [class*=hamburger], [class*=mobile]')].filter(e => { const r = e.getBoundingClientRect(); return r.top < 120 && r.width > 0 && r.height > 0; }).map(e => e.tagName + '.' + e.className.toString().slice(0, 50) + ' "' + (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 25) + '" ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height) + ' @' + Math.round(e.getBoundingClientRect().left) + ',' + Math.round(e.getBoundingClientRect().top)));
  console.log('==', u); console.log(r.join('\n')); }
 await b.close(); })();
