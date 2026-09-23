const L = require('./lib');
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
 await L.goto(p, L.N + '/product-category/subwoofer/'); await L.settle(p);
 const info = await p.evaluate(() => ({ cmpBtns: [...document.querySelectorAll('button')].filter(b => /compar/i.test(b.innerText + b.getAttribute('aria-label'))).map(b => (b.getAttribute('aria-label') || b.innerText).trim()).slice(0, 20),
   compareEl: document.querySelector('[class*=bh2-compare]')?.outerHTML.slice(0, 1500), ls: Object.keys(localStorage), cards: document.querySelectorAll('a[href*="/product/"]').length }));
 console.log(JSON.stringify(info, null, 1)); await b.close(); })();
