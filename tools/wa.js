const L = require('./lib');
(async () => { const b = await L.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
 for (const u of [L.O + '/', L.O + '/product/bh-sw12xxg/', L.O + '/ventas-al-mayor/', L.N + '/', L.N + '/product/bh-sw12xxg/', L.N + '/distribuidores/', L.N + '/soporte/']) {
  await L.goto(p, u); await L.settle(p);
  const r = await p.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"],a[href^="tel:"],a[href^="mailto:"]')].map(a => (a.innerText.trim().replace(/\s+/g, ' ').slice(0, 30) || a.getAttribute('aria-label') || '(icon)') + ' -> ' + decodeURIComponent(a.href)))]);
  const fixed = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'fixed' && e.offsetWidth > 20 && e.offsetHeight > 20).map(e => e.tagName + '.' + e.className.toString().slice(0, 50) + ' ' + (e.innerText || '').slice(0, 30)).slice(0, 8));
  console.log('==', u, '\n ', r.join('\n  '), '\n  fixed:', JSON.stringify(fixed)); }
 await b.close(); })();
