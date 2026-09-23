const L = require('./lib'); const OUT = '../evidence/interactions/'; const vpn = process.argv[2] || 'd';
const VP = vpn === 'd' ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
(async () => { const b = await L.launch(); const ctx = await b.newContext(VP); const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERROR', e.message));
 for (const [tag, u] of [['A', L.O + '/galeria-de-fotos/'], ['N', L.N + '/galeria/']]) {
  await L.goto(p, u); await L.settle(p);
  const items = await p.evaluate(() => [...document.querySelectorAll('main img, .entry-content img, #content img, .gallery img, [class*=gallery] img')].filter(i => i.getBoundingClientRect().width > 100).map(i => ({ src: i.currentSrc.split('/').pop(), alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, link: i.closest('a')?.href?.split('/').pop() || null, btn: !!i.closest('button') })));
  console.log(tag, 'gallery items', items.length, JSON.stringify(items.slice(0, 3)));
  const first = p.locator('main img, .entry-content img, #content img').filter({ visible: true }).nth(0);
  const tgt = p.locator('a:has(img), button:has(img)').filter({ visible: true }); const n = await tgt.count();
  // click first gallery item within content (skip logo)
  let clicked = false; for (let i = 0; i < n && !clicked; i++) { const el = tgt.nth(i); const bb = await el.boundingBox(); if (bb && bb.y > 150 && bb.width > 100) { await el.click(); clicked = true; } }
  await p.waitForTimeout(1800); await p.screenshot({ path: OUT + `${tag}-gal-01-lightbox-${vpn}.png` });
  const lb = await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog], dialog[open], .mfp-wrap, .pswp--open, .lightbox, [class*=lightbox], .fancybox-container, .elementor-lightbox')].filter(e => e.offsetParent || getComputedStyle(e).display !== 'none'); return d.map(e => e.tagName + '.' + e.className.toString().slice(0, 60) + ' btns=' + [...e.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.title || b.innerText.trim()).filter(Boolean).join('/')).slice(0, 3); });
  console.log(tag, 'lightbox:', JSON.stringify(lb), 'url', p.url());
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1500); await p.screenshot({ path: OUT + `${tag}-gal-02-next-${vpn}.png` });
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200); await p.screenshot({ path: OUT + `${tag}-gal-03-closed-${vpn}.png` });
  const still = await p.evaluate(() => [...document.querySelectorAll('[role=dialog], dialog[open], .mfp-wrap, .pswp--open, [class*=lightbox]')].filter(e => e.offsetParent && e.getBoundingClientRect().height > 200).length); console.log(tag, 'open after Esc:', still);
 }
 await b.close(); })();
