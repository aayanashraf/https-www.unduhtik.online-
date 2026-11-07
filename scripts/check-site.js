const fs = require('fs'), path = require('path');
const SITE = 'https://www.unduhtik.online/';
const PUB = path.join(__dirname, '..', 'public');
const errs = [];

const walk = d => fs.readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);

function exists(u) {
  const base = path.join(PUB, decodeURIComponent(new URL(u).pathname));
  return [base, base + '.html', path.join(base, 'index.html')]
    .some(f => { try { return fs.statSync(f).isFile(); } catch { return false; } });
}

for (const f of walk(PUB)) {
  const rel = path.relative(PUB, f);
  if (!/\.(html|xml|json|js|txt|webmanifest)$/i.test(f)) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (/public_backup|file:\/\/\//.test(t)) errs.push(`${rel}: has public_backup or file:///`);
  if (!/\.js$/i.test(f) && /\b[A-Za-z]:\\/.test(t)) errs.push(`${rel}: has a local Windows path (e.g. D:\\)`);
  if (/\.html$/i.test(f)) {
    for (const tag of t.match(/<link\b[^>]*>/gi) || []) {
      if (!/rel="canonical"|hreflang=/i.test(tag)) continue;
      const h = (tag.match(/href="([^"]*)"/i) || [])[1] || '';
      if (!h.startsWith(SITE)) errs.push(`${rel}: bad canonical/hreflang href: ${h}`);
    }
  }
}

const sm = fs.readFileSync(path.join(PUB, 'sitemap-unduhtik.xml'), 'utf8');
const urls = [
  ...[...sm.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1]),
  ...[...sm.matchAll(/<xhtml:link[^>]*href="([^"]+)"/g)].map(m => m[1]),
];
for (const u of urls) {
  if (!u.startsWith(SITE)) errs.push(`sitemap: bad URL ${u}`);
  else if (!exists(u)) errs.push(`sitemap: no file for ${u}`);
}

if (errs.length) { console.error('CHECK FAILED:\n' + errs.join('\n')); process.exit(1); }
console.log(`OK: ${urls.length} sitemap URLs checked, no bad paths found.`);