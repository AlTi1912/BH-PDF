const L = require('./lib'); const OUT = '../evidence/interactions/'; const vpn = process.argv[2] || 'd';
const VP = vpn === 'd' ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
(async () => { const b = await L.launch(); const ctx = await b.newContext(VP); const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('dialog', d => { console.log('DIALOG', d.message()); d.dismiss(); });
 await L.goto(p, L.N + '/product-category/subwoofer/'); await L.settle(p);
 const bar = async (tag) => { const s = await p.evaluate(() => { const b = document.querySelector('[data-compare-bar]'); return { hidden: b.hidden, count: b.querySelector('[data-compare-count]').innerText, items: b.querySelector('[data-compare-items]').innerText.replace(/\s+/g, ' '), toast: [...document.querySelectorAll('[role=status],[aria-live]')].map(e => e.innerText.trim()).filter(Boolean).join(' | '), ls: JSON.stringify(Object.fromEntries(Object.entries(localStorage))).slice(0, 300) }; }); console.log(tag, JSON.stringify(s)); };
 const add = async (m) => { const btn = p.getByRole('button', { name: 'Añadir a comparación: ' + m, exact: true }); await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(900); };
 await bar('start');
 await add('BH-SW12XXG'); await bar('add1'); await p.screenshot({ path: OUT + `N-cmp-01-add1-${vpn}.png` });
 await add('BH-SW12IPAL'); await add('BH-SW12LJD'); await bar('add3'); await p.screenshot({ path: OUT + `N-cmp-02-add3-${vpn}.png` });
 await add('BH-SW12LS4'); await bar('add4'); await p.screenshot({ path: OUT + `N-cmp-03-add4-limit-${vpn}.png` });
 const lab = await p.getByRole('button', { name: /BH-SW12XXG/ }).first().getAttribute('aria-label').catch(() => null); console.log('xxg btn label after', lab, await p.getByRole('button', { name: /BH-SW12XXG/ }).first().getAttribute('aria-pressed').catch(() => null));
 await p.locator('[data-compare-open]').click(); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + `N-cmp-04-open-${vpn}.png` }); await p.screenshot({ path: OUT + `N-cmp-04-open-full-${vpn}.png`, fullPage: true });
 const table = await p.evaluate(() => { const d = document.querySelector('.bh2-compare, [class*=bh2-compare]:not(.bh2-compare-bar)'); const dlg = [...document.querySelectorAll('[role=dialog], dialog, .bh2-compare')].find(e => e.offsetParent || e.open); return dlg ? dlg.innerText.replace(/\n+/g, ' ¦ ').slice(0, 2500) : 'no dialog'; }); console.log('TABLE', table);
 // scroll inside panel if scrollable
 await p.keyboard.press('Escape'); await p.waitForTimeout(800); await bar('after-esc');
 // navigate to other page for persistence
 await L.goto(p, L.N + '/product/bh-8-12dsp/'); await L.settle(p); await bar('other-page'); await p.screenshot({ path: OUT + `N-cmp-05-persist-${vpn}.png` });
 await b.close(); })();
