const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [,, base, out] = process.argv;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--ignore-certificate-errors-spki-list=' + require('fs').readFileSync(__dirname + '/spki.txt','utf8').trim()] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const r = await p.goto(base, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => ({ status: () => 'ERR ' + e.message }));
  console.log('status', r.status());
  await p.waitForTimeout(2500);
  const data = await p.evaluate(() => {
    const links = [...document.querySelectorAll('a[href]')].map(a => ({ t: (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60), h: a.href, inHeader: !!a.closest('header,nav'), inFooter: !!a.closest('footer') }));
    return { title: document.title, links, h1: [...document.querySelectorAll('h1')].map(h => h.innerText) };
  });
  require('fs').writeFileSync(out, JSON.stringify(data, null, 1));
  const u = new Map(); data.links.forEach(l => { if (!u.has(l.h)) u.set(l.h, l); });
  console.log(data.title, '| H1:', data.h1);
  for (const [h, l] of u) console.log((l.inHeader ? 'H ' : l.inFooter ? 'F ' : '  ') + h + '  | ' + l.t);
  await b.close();
})();
