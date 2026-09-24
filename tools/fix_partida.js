const L = require('./lib');
(async () => { const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 1500 }, locale: 'es-PE' }); const p = await ctx.newPage();
 const r = await L.goto(p, L.O + '/'); await L.settle(p);
 // volver a la primera diapositiva del banner, como en la captura original
 await p.locator('button:text-is("1")').filter({ visible: true }).first().click({ timeout: 4000 }).catch(() => {});
 await p.waitForTimeout(2500);
 console.log('http', r.status(), 'scrollY', await p.evaluate(() => scrollY), 'H', await p.evaluate(() => document.documentElement.scrollHeight));
 await p.screenshot({ path: '../evidence/screens/A-home-d-1500.png' });
 await b.close(); })();
