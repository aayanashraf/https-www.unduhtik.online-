const fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const read = f => fs.readFileSync(f, 'utf8');
const idsOf = t => new Set([...t.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
const sectionIdsOf = t => new Set([...t.matchAll(/<(section|header|footer|nav|main|aside)\b[^>]*?\bid="([^"]+)"/g)].map(m => m[2]));
const adOf = t => new Set([...t.matchAll(/class="([^"]*)"/g)].map(m => m[1]).join(' ').split(/\s+/)
  .filter(c => /(^ad$|^ads?[-_]|[-_]ads?$|adsbygoogle)/i.test(c)));
const FEATURES = {
  'theme toggle (#themeToggle)': /id="themeToggle"/,
  'language switcher (#langSwitcher)': /id="langSwitcher"/,
  'hamburger (#hamburgerBtn)': /id="hamburgerBtn"/,
  'main nav (#mainNav)': /id="mainNav"/,
  'GA4 G-HS6KJ4V1CL': /G-HS6KJ4V1CL/,
  'window.track': /window\.track/,
  'data-track attributes': /data-track=/,
  'canonical': /rel="canonical"/,
  'hreflang x-default': /hreflang="x-default"/,
  'FAQPage JSON-LD': /"FAQPage"/,
  'header': /<header\b/,
  'footer': /<footer\b/,
  'style.css': /href="\/?style\.css/,
  'theme.css': /href="\/?theme\.css/,
};
const REQUIRED = ['tiktokUrl','pasteBtn','downloadBtn','status','result','cover','videoTitle','videoAuthor',
  'downloadNoWm','downloadWm','downloadMusic','copyLinkBtn','slideshowResult','slideshowTitle','slideshowAuthor',
  'slideshowGrid','downloadSlideshowMusic','langSwitcher','themeToggle','hamburgerBtn','mainNav'];
const basePath = path.join(PUB, 'index.html');
const base = read(basePath);
const B = {
  structs: sectionIdsOf(base), ads: adOf(base), ids: idsOf(base),
  feats: Object.keys(FEATURES).filter(k => FEATURES[k].test(base)),
  sections: (base.match(/<section\b/g) || []).length,
};
const pages = walk(PUB).filter(f => /\.html$/i.test(f));
const titles = new Map();
let bad = 0;
for (const f of pages) {
  const rel = path.relative(PUB, f).replace(/\\/g, '/');
  const t = read(f), probs = [];
  const ids = idsOf(t), st = sectionIdsOf(t), ads = adOf(t);
  const title = (t.match(/<title>([^<]*)<\/title>/i) || [])[1];
  if (!title) probs.push('no <title>');
  else titles.set(title.trim(), [...(titles.get(title.trim()) || []), rel]);
  if (!/<meta name="description" content="[^"]+"/i.test(t)) probs.push('no meta description');
  const h1 = (t.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) probs.push(`h1 count is ${h1} (want 1)`);
  for (const k of B.feats) if (!FEATURES[k].test(t)) probs.push(`missing: ${k}`);
  for (const id of B.structs) if (!st.has(id)) probs.push(`missing section #${id}`);
  const miss = [...B.ads].filter(a => !ads.has(a));
  if (miss.length) probs.push(`missing ad slot class: ${miss.join(', ')}`);
  const sc = (t.match(/<section\b/g) || []).length;
  if (sc < B.sections) probs.push(`sections: ${sc} (index has ${B.sections})`);
  if (t.includes('/script.js')) {
    const m = REQUIRED.filter(id => !ids.has(id));
    if (m.length) probs.push(`missing required ids: ${m.join(', ')}`);
  }
  if (probs.length) { bad++; console.log(`\n${rel}\n  - ` + probs.join('\n  - ')); }
}
for (const [tt, files] of titles) if (files.length > 1) {
  bad++; console.log(`\nDUPLICATE title "${tt}":\n  - ` + files.join('\n  - '));
}
console.log(`\n${pages.length - bad} of ${pages.length} pages fully match, ${bad} with gaps.`);