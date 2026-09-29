// Capturas del rediseño (29-09-2026) para la presentación V2.
const { chromium } = require('playwright');
const N = 'https://fiction-videos-written-appearing.trycloudflare.com';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const go = async (u) => { await p.goto(N + u, { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(1500); };
  await go('/'); await p.screenshot({ path: 'img/v2-home.png' });
  await go('/product/bh-fr1500-1/'); await p.screenshot({ path: 'img/v2-ficha-fr1500.png' });
  await go('/shop/'); await p.screenshot({ path: 'img/v2-shop.png' });
  await go('/distribuidores/'); await p.screenshot({ path: 'img/v2-distribuidores.png' });
  // comparador: agregar 3 amplificadores FR desde sus fichas
  for (const s of ['bh-fr1500-1', 'bh-fr3000-1', 'bh-fr15000-1']) {
    await go('/product/' + s + '/');
    const btn = p.locator('button:has-text("Comparar"), a:has-text("Comparar")').first();
    if (await btn.count()) { await btn.click(); await p.waitForTimeout(800); }
  }
  const open = p.locator('.bh2-compare-bar button, [data-compare-open], button:has-text("Ver comparación"), button:has-text("Comparar ahora")').first();
  console.log('open', await open.count());
  if (await open.count()) { await open.click(); await p.waitForTimeout(1500); }
  await p.screenshot({ path: 'img/v2-comparador.png' });
  await b.close();
})();
