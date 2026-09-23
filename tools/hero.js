const L = require('./lib'); const OUT = '../evidence/screens/';
(async () => { const b = await L.launch();
 for (const vpn of (process.argv[2]||'d,m').split(',')) { const VP = vpn === 'd' ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
  const ctx = await b.newContext(VP); const p = await ctx.newPage();
  // OLD: slick/owl dots
  await L.goto(p, L.O + '/'); await L.settle(p);
  const od = await p.evaluate(() => [...document.querySelectorAll('button, li')].filter(e => /^1$/.test(e.innerText.trim()) && e.offsetParent).length); 
  await p.locator('button:text-is("1")').filter({ visible: true }).first().click({ timeout: 3000 }).catch(e => console.log('old dot', e.message.slice(0, 80)));
  await p.waitForTimeout(1600); await p.screenshot({ path: OUT + `A-hero1-${vpn}.png` });
  // NEW
  await L.goto(p, L.N + '/'); await L.settle(p);
  await p.getByRole('button', { name: 'Mostrar banner 1' }).click({ timeout: 3000 }).catch(e => console.log('new dot', e.message.slice(0, 80)));
  await p.waitForTimeout(1600); await p.screenshot({ path: OUT + `N-hero1-${vpn}.png` });
  if (vpn === 'd') { await L.goto(p, L.O + '/'); await L.settle(p); const card = p.locator('a[href*="/product/bh-sw12xxg/"]').first(); await card.scrollIntoViewIfNeeded(); await card.hover(); await p.waitForTimeout(800); const q = p.getByText('Quick View').filter({ visible: true }).first(); console.log('qv visible', await q.count()); if (await q.count()) await q.click(); else await p.evaluate(() => document.querySelector('a.quickview, [class*=quick-view] a, a[href="javascript:void(0)"]')?.click()); await p.waitForTimeout(2500);
   console.log('old quickview', await p.evaluate(() => { const d = [...document.querySelectorAll('.quickview, [class*=quick], .mfp-content, [class*=modal]')].filter(e => e.offsetParent && e.getBoundingClientRect().height > 150); return d.map(e => e.className.toString().slice(0, 50) + ': ' + e.innerText.replace(/\s+/g, ' ').slice(0, 200)).slice(0, 2); }));
   await p.screenshot({ path: '../evidence/interactions/A-quickview-01-d.png' }); }
  await ctx.close(); }
 await b.close(); })();
