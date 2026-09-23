const L = require('./lib'); const OUT = '../evidence/interactions/';
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
 for (const [i, q] of [['02', 'BH-SW12XXG'], ['03', 'FR'], ['04', 'sw12']]) {
  await L.goto(p, L.O + '/'); await L.settle(p);
  const inp = p.locator('header input[name=s]:visible, input[name=s]:visible').first();
  await inp.click(); await inp.type(q, { delay: 60 }); await p.waitForTimeout(3000);
  await p.screenshot({ path: OUT + `A-search-${i}-typed-${q}-d.png` });
  const live = await p.evaluate(() => [...document.querySelectorAll('[class*=search] a[href*="/product/"], .autocomplete-suggestion, [class*=result] a')].filter(a => a.offsetParent).map(a => a.innerText.trim()).slice(0, 10));
  console.log(q, 'live:', JSON.stringify(live));
  await inp.press('Enter'); await p.waitForLoadState('domcontentloaded'); await L.settle(p);
  await p.screenshot({ path: OUT + `A-search-${i}-submit-${q}-d.png`, fullPage: true });
  const res = await p.evaluate(() => ({ url: location.href, h: document.querySelector('h1')?.innerText, n: [...new Set([...document.querySelectorAll('main a[href*="/product/"], .products a[href*="/product/"]')].map(a => a.href))], info: document.querySelector('.woocommerce-result-count, .woocommerce-info')?.innerText }));
  console.log(JSON.stringify(res)); }
 await b.close(); })();
