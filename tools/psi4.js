const L = require('./lib');
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 900 }, locale: 'es-PE', deviceScaleFactor: 2 });
 await p.goto('https://pagespeed.web.dev/analysis/https-www-blackhawkcaraudio-com/xl9a3dkfey?form_factor=mobile', { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {});
 await p.waitForTimeout(6000);
 const box = await p.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => /^Informe desde/.test(e.textContent.trim()) && e.children.length === 0); const f = [...document.querySelectorAll('*')].filter(e => /Duración completa de las visitas/.test(e.textContent) && e.getBoundingClientRect().height > 200).pop(); const a = h.getBoundingClientRect(), c = f.getBoundingClientRect(); return { x: c.left - 8, y: a.top - 12, w: c.width + 16, h: c.bottom - a.top + 20 }; });
 console.log(box);
 await p.screenshot({ path: '../evidence/pagespeed/psi-antes-mobile-campo.png', clip: { x: box.x, y: box.y, width: box.w, height: box.h } });
 await b.close(); })();
