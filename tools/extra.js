const L = require('./lib'); const OUT = '../evidence/interactions/';
(async () => { const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage(); p.on('pageerror', e => console.log('PAGEERROR', e.message));
 await L.goto(p, L.N + '/product-category/subwoofer/'); await L.settle(p);
 for (const m of ['BH-SW12XXG', 'BH-SW12IPAL', 'BH-SW12LJD']) { const btn = p.getByRole('button', { name: 'Añadir a comparación: ' + m, exact: true }); await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(600); }
 await p.locator('[data-compare-open]').click(); await p.waitForTimeout(1500);
 const dlg = p.locator('.bh2-compare').first();
 const wa = await p.evaluate(() => [...document.querySelectorAll('.bh2-compare a[href*="wa.me"]')].map(a => decodeURIComponent(a.href))); console.log('compare WA', wa);
 // screenshot of scrollable body: find scroll container
 const sc = await p.evaluate(() => { const els = [...document.querySelectorAll('.bh2-compare *')].filter(e => e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); return els.map(e => e.className + ' ' + e.scrollHeight + '/' + e.clientHeight); }); console.log('scrollers', sc);
 await p.evaluate(() => { const e = [...document.querySelectorAll('.bh2-compare *')].find(e => e.scrollHeight > e.clientHeight + 20 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)); if (e) e.scrollTop = 520; }); await p.waitForTimeout(700);
 await p.screenshot({ path: OUT + 'N-cmp-06-specs-d.png' });
 await p.getByRole('button', { name: /Quitar/ }).filter({ visible: true }).nth(2).click().catch(async () => { await p.getByText('Quitar', { exact: true }).nth(2).click(); }); await p.waitForTimeout(1000);
 console.log('after quitar', await p.evaluate(() => document.querySelector('[data-compare-count]').innerText)); await p.screenshot({ path: OUT + 'N-cmp-07-removed-d.png' });
 await p.getByRole('button', { name: /Cerrar comparador/ }).click().catch(() => p.keyboard.press('Escape')); await p.waitForTimeout(800);
 await p.locator('[data-compare-clear]').click(); await p.waitForTimeout(800); console.log('after clear hidden', await p.evaluate(() => document.querySelector('[data-compare-bar]').hidden));
 // quick view
 await L.goto(p, L.N + '/'); await L.settle(p);
 const qv = p.getByRole('button', { name: /Vista rápida/ }).first(); await qv.scrollIntoViewIfNeeded(); const lab = await qv.getAttribute('aria-label'); await qv.click(); await p.waitForTimeout(1800);
 console.log('quickview', lab, (await p.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(e => e.offsetParent && e.getBoundingClientRect().height > 100); return d ? d.innerText.replace(/\s+/g, ' ').slice(0, 400) : 'none'; })));
 await p.screenshot({ path: OUT + 'N-quickview-01-d.png' });
 // catalog filters
 await L.goto(p, L.N + '/shop/'); await L.settle(p);
 await p.getByLabel(/^Subwoofer\b/).first().check().catch(e => console.log('check err', e.message)); await p.getByRole('button', { name: /Aplicar filtros/i }).click(); await p.waitForLoadState('domcontentloaded'); await L.settle(p);
 console.log('filter url', p.url(), await p.evaluate(() => document.body.innerText.match(/\d+\s+productos/)?.[0])); await p.screenshot({ path: OUT + 'N-filter-01-subwoofer-d.png' });
 const sel = p.locator('select').filter({ visible: true }).first(); const opts = await sel.evaluate(s => [...s.options].map(o => o.textContent.trim() + '=' + o.value)).catch(() => []); console.log('sort options', opts);
 await b.close(); })();
