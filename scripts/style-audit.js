const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = 'http://localhost:3000';
const sm = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap-unduhtik.xml'), 'utf8');
const urls = [...new Set([...sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].replace('https://www.unduhtik.online', BASE)))];
const COMP = {
  header: 'header.site-header, header',
  'nav link': 'header nav a',
  'logo Unduh': '.logo-text .b-u',
  'logo Tik': '.logo-text .b-t',
  h1: 'h1',
  h2: 'main h2, h2',
  text: 'main p, p',
  'main link': 'main a',
  button: 'button',
  footer: 'footer',
  'footer link': 'footer a'
};
function sigs(comp) {
  const out = {};
  for (const [k, sel] of Object.entries(comp)) {
    const el = document.querySelector(sel);
    if (!el) { out[k] = 'missing'; continue; }
    const c = getComputedStyle(el);
    out[k] = `text ${c.color} | bg ${c.backgroundColor}${c.backgroundImage !== 'none' ? '+gradient' : ''} | ${c.fontFamily.split(',')[0].replace(/"/g, '')} ${c.fontSize}`;
  }
  return out;
}
(async () => {
  const br = await chromium.launch();
  for (const theme of ['light', 'dark']) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, colorScheme: theme });
    await ctx.addInitScript(t => { try { localStorage.setItem('unduhtik_theme', t); } catch (e) {} }, theme);
    const table = {};
    for (const u of urls) {
      const p = await ctx.newPage();
      try { await p.goto(u, { waitUntil: 'load', timeout: 20000 }); } catch (e) { await p.close(); continue; }
      const s = await p.evaluate(sigs, COMP);
      const name = u.replace(BASE, '') || '/';
      for (const [k, v] of Object.entries(s)) ((table[k] = table[k] || {})[v] = table[k][v] || []).push(name);
      await p.close();
    }
    console.log(`\n================ ${theme.toUpperCase()} ================`);
    for (const [k, groups] of Object.entries(table)) {
      const g = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
      if (g.length < 2) { console.log(`OK   ${k}: same on all pages`); continue; }
      console.log(`DIFF ${k}: ${g.length} variants`);
      g.forEach(([v, pages], i) => console.log(`   ${i === 0 ? 'main' : 'odd '} (${pages.length}) ${v}\n        e.g. ${pages.slice(0, 4).join(', ')}`));
    }
    await ctx.close();
  }
  await br.close();
})();