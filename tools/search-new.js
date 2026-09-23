const L = require('./lib'); const OUT = '../evidence/interactions/';
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
 await L.goto(p, L.N + '/'); await L.settle(p);
 await p.getByRole('button', { name: 'Buscar' }).first().click(); await p.waitForTimeout(1200);
 await p.screenshot({ path: OUT + 'N-search-01-open-d.png' });
 const inp = p.locator('input[name=bh_q]:visible').first(); console.log('input visible', await inp.count());
 for (const [i, q] of [['02', 'BH-SW12XXG'], ['03', 'FR'], ['04', 'sw12']]) {
  await inp.fill(''); await inp.type(q, { delay: 60 }); await p.waitForTimeout(2500);
  await p.screenshot({ path: OUT + `N-search-${i}-live-${q}-d.png` });
  const res = await p.evaluate(() => { const box = document.querySelector('input[name=bh_q]').closest('form, [role=dialog], div'); const d = document.querySelector('[class*=search]'); return [...document.querySelectorAll('[class*=search] a[href*="/product/"]')].filter(a => a.offsetParent).map(a => a.innerText.replace(/\s+/g, ' ').trim()).slice(0, 12); });
  console.log(q, 'live results:', JSON.stringify(res)); }
 await inp.fill('BH-SW12XXG'); await inp.press('Enter'); await p.waitForLoadState('domcontentloaded'); await L.settle(p);
 console.log('submit url', p.url()); await p.screenshot({ path: OUT + 'N-search-05-submit-d.png' });
 const cnt = await p.evaluate(() => [...document.querySelectorAll('a[href*="/product/"]')].filter(a => a.closest('main')).map(a => a.href).filter((v, i, s) => s.indexOf(v) === i));
 console.log('results', cnt.length, cnt.slice(0, 10));
 await b.close(); })();
