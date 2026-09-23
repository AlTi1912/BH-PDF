const L = require('./lib'); const OUT = '../evidence/interactions/';
(async () => { const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERROR', p.url(), e.message));
 // OLD menu
 await L.goto(p, L.O + '/'); await L.settle(p);
 await p.locator('a.m-menu-btn').first().tap(); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'A-mmenu-01-open-m.png' });
 await p.locator('.mobile-menu .navbar-toggler').first().tap().catch(e => console.log('old submenu', e.message)); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'A-mmenu-02-productos-m.png' });
 // OLD mobile search
 await L.goto(p, L.O + '/'); await L.settle(p);
 await p.locator('.search-block-mobile button').first().tap(); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'A-msearch-01-open-m.png' });
 const oi = p.locator('input[name=s]:visible').first(); if (await oi.count()) { await oi.type('sw12', { delay: 80 }); await p.waitForTimeout(3000); await p.screenshot({ path: OUT + 'A-msearch-02-sw12-m.png' }); } else console.log('old mobile search input not visible');
 // NEW menu
 await L.goto(p, L.N + '/'); await L.settle(p);
 await p.getByRole('button', { name: 'Abrir menú' }).tap(); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + 'N-mmenu-01-open-m.png' });
 const pb = p.getByRole('button', { name: /^Productos/ }).filter({ visible: true }).first(); await pb.tap().catch(e => console.log('new submenu', e.message)); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + 'N-mmenu-02-productos-m.png' });
 // NEW mobile search
 await L.goto(p, L.N + '/'); await L.settle(p);
 await p.getByRole('button', { name: 'Buscar productos' }).tap(); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + 'N-msearch-01-open-m.png' });
 const ni = p.locator('input[name=bh_q]:visible').first(); await ni.type('sw12', { delay: 80 }); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'N-msearch-02-sw12-m.png' });
 await b.close(); })();
