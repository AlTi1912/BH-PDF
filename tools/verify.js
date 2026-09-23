const L = require('./lib');
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
 const box = async (sel, txt) => p.evaluate(([s, t]) => { let els = [...document.querySelectorAll(s)]; if (t) els = els.filter(e => e.innerText.trim().startsWith(t)); const e = els.find(e => e.getBoundingClientRect().width > 0); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]; }, [sel, txt]);
 await L.goto(p, L.O + '/product/bh-sw12xxg/'); await L.settle(p);
 console.log('A prod', JSON.stringify({ bc: await box('.breadcrumb, nav.woocommerce-breadcrumb, [class*=breadcrumb]'), h1: await box('h1'), sub: await box('.summary h2, .summary .subtitle, .summary p, .summary strong'), ul: await box('.summary ul, .woocommerce-product-details__short-description ul'), cat: await box('.posted_in, .product_meta'), img: await box('.woocommerce-product-gallery__image img, .woocommerce-product-gallery img') }));
 await L.goto(p, L.N + '/product/bh-sw12xxg/'); await L.settle(p);
 console.log('N prod', JSON.stringify({ bc: await box('[class*=breadcrumb]'), h1: await box('h1'), cot: await box('a[href*="wa.me"]', 'COTIZAR'), acts: await box('button', 'Copiar'), ul: await box('main ul'), eye: await box('main [class*=eyebrow], main [class*=kicker]') }));
 const cot = await p.evaluate(() => [...document.querySelectorAll('main a[href*="wa.me"]')].map(a => a.innerText.trim() + ' ' + JSON.stringify(a.getBoundingClientRect().toJSON())).slice(0, 3)); console.log(cot);
 // mobile COTIZAR position
 const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }); const m = await ctx.newPage(); await L.goto(m, L.N + '/product/bh-sw12xxg/'); await L.settle(m);
 console.log('N mobile cotizar', await m.evaluate(() => [...document.querySelectorAll('main a[href*="wa.me"]')].map(a => a.innerText.trim() + ' top=' + Math.round(a.getBoundingClientRect().top + scrollY) + ' h=' + Math.round(a.getBoundingClientRect().height))));
 console.log('N mobile header pos', await m.evaluate(() => getComputedStyle(document.querySelector('.bh2-header')).position));
 // submit counts
 for (const q of ['FR', 'sw12']) { await L.goto(p, L.N + '/shop/?bh_q=' + q); await L.settle(p); console.log('N submit', q, await p.evaluate(() => document.body.innerText.match(/(\d+)\s+productos/)?.[0]), await p.evaluate(() => [...new Set([...document.querySelectorAll('main a[href*="/product/"]')].map(a => a.href.split('/product/')[1]))].join(' '))); }
 // old mayoristas logos
 await L.goto(p, L.O + '/ventas-al-mayor/'); await L.settle(p);
 console.log('A mayor imgs', JSON.stringify(await p.evaluate(() => [...document.images].map(i => [i.alt, i.src.split('/').pop().slice(0, 40), i.naturalWidth]).filter(x => x[2] === 0))));
 // privacy headings
 await L.goto(p, L.N + '/politica-de-privacidad/'); await L.settle(p);
 console.log('priv', await p.evaluate(() => [...document.querySelectorAll('main h1, main h2, main h3')].map(h => h.innerText.trim()).join(' | ')));
 // old skip link
 await L.goto(p, L.O + '/'); console.log('A skip', await p.evaluate(() => [...document.querySelectorAll('a')].filter(a => /salta|skip/i.test(a.innerText + a.className)).map(a => a.innerText + '|' + a.className)));
 await b.close(); })();
