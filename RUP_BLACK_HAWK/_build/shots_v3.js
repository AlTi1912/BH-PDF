// Capturas del 29-09-2026: sitio original (A) y web renovada (N), mismas vistas y viewport.
const { chromium } = require('playwright');
const O = 'https://www.blackhawkcaraudio.com', N = 'https://fiction-videos-written-appearing.trycloudflare.com';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const shot = async (base, path, file, vp = { width: 1440, height: 900 }, mobile = false) => {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    const p = await ctx.newPage();
    try { await p.goto(base + path, { waitUntil: 'networkidle', timeout: 90000 }); } catch (e) { console.log('timeout', file); }
    await p.waitForTimeout(2000);
    await p.screenshot({ path: 'img/v3-' + file + '.png' });
    await ctx.close();
  };
  for (const [base, t] of [[O, 'A'], [N, 'N']]) {
    await shot(base, '/', t + '-home');
    await shot(base, '/shop/', t + '-shop');
    await shot(base, '/product/bh-sw12xxg/', t + '-ficha');
    await shot(base, '/', t + '-home-m', { width: 390, height: 844 }, true);
    await shot(base, '/product/bh-sw12xxg/', t + '-ficha-m', { width: 390, height: 844 }, true);
  }
  await shot(N, '/distribuidores/', 'N-distribuidores');
  await shot(O, '/ventas-al-mayor/', 'A-mayoristas');
  await shot(N, '/mayoristas/', 'N-mayoristas');
  await b.close();
})();
