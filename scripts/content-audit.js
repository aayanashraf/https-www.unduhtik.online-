const fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const LANGS = new Set(['en','es','fr','hi','ms','pt','th','tr','vi','ar']);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const decode = s => s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"')
  .replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&[a-z#0-9]+;/gi,' ');
function textOf(html) {
  const h = html.replace(/<!--[\s\S]*?-->/g,' ')
    .replace(/<(script|style|noscript|svg|nav|header|footer|select|button)\b[\s\S]*?<\/\1>/gi,' ')
    .replace(/<[^>]+>/g,' ');
  return decode(h).replace(/\s+/g,' ').trim();
}
const pages = walk(PUB).filter(f => /\.html$/i.test(f)).map(f => {
  const rel = path.relative(PUB, f).replace(/\\/g,'/');
  const words = textOf(fs.readFileSync(f,'utf8')).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(Boolean);
  const sh = new Set();
  for (let i = 0; i + 5 <= words.length; i++) sh.add(words.slice(i, i + 5).join(' '));
  const first = rel.split('/')[0];
  const lang = rel.includes('/') && LANGS.has(first) ? first : 'id';
  return { rel, lang, n: words.length, sh };
});
console.log('== THIN PAGES (under 300 words of main text) ==');
pages.filter(p => p.n < 300).sort((a,b) => a.n - b.n).forEach(p => console.log(`${p.n}\t${p.rel}`));
const zero = pages.filter(p => p.n === 0).length;
if (zero) console.log(`(${zero} pages have no readable text)`);
const jac = (a, b) => { let i = 0; const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) i++; return i / ((a.size + b.size - i) || 1); };
const pairs = [];
for (let i = 0; i < pages.length; i++) for (let j = i + 1; j < pages.length; j++) {
  const a = pages[i], b = pages[j];
  if (!a.n || !b.n) continue;
  const s = jac(a.sh, b.sh);
  if (s >= 0.3) pairs.push({ s, a: a.rel, b: b.rel, same: a.lang === b.lang });
}
pairs.sort((x, y) => y.s - x.s);
console.log('\n== NEAR-DUPLICATE PAIRS (30% or more shared text) ==');
pairs.forEach(p => console.log(`${(p.s*100).toFixed(0)}%\t${p.same ? 'same-lang ' : 'cross-lang'}\t${p.a}  <->  ${p.b}`));
console.log(`\n${pages.length} pages checked, ${pages.filter(p=>p.n<300).length} thin, ${pairs.length} near-duplicate pairs.`);