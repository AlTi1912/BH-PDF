const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const SPKI = fs.readFileSync(__dirname + '/spki.txt', 'utf8').trim();
exports.O = 'https://www.blackhawkcaraudio.com';
exports.N = 'https://obj-sociology-humidity-delhi.trycloudflare.com';
exports.launch = () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--ignore-certificate-errors-spki-list=' + SPKI] });
exports.settle = async (p) => {
  await p.waitForLoadState('networkidle', { timeout: 45000 }).catch(() => {});
  // scroll through to trigger lazy loading
  await p.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h + 900; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 260)); } await new Promise(r => setTimeout(r, 800)); window.scrollTo(0, 0); });
  await p.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await p.evaluate(() => document.fonts && document.fonts.ready);
  await p.evaluate(async () => { await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 8000); }))); });
  await p.waitForTimeout(2500);
};
exports.goto = async (p, url) => { let last; for (let i = 0; i < 3; i++) { try { const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 }); return r; } catch (e) { last = e; await p.waitForTimeout(3000); } } throw last; };
