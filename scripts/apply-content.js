const fs = require('fs'), path = require('path');
const PUB = path.join(__dirname, '..', 'public');
const CON = path.join(__dirname, '..', 'content');
const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
let n = 0;
for (const src of walk(CON).filter(f => /\.html$/i.test(f))) {
  const rel = path.relative(CON, src), dst = path.join(PUB, rel);
  if (!fs.existsSync(dst)) { console.log('no target: ' + rel); continue; }
  const body = fs.readFileSync(src, 'utf8').trim();
  let t = fs.readFileSync(dst, 'utf8');
  const re = /<!-- UT-CONTENT:START -->[\s\S]*?<!-- UT-CONTENT:END -->/;
  if (!re.test(t)) { console.log('no marker: ' + rel); continue; }
  t = t.replace(re, () => '<!-- UT-CONTENT:START -->\n' + body + '\n<!-- UT-CONTENT:END -->');
  fs.writeFileSync(dst, t, 'utf8'); n++; console.log('applied: ' + rel);
}
console.log(n + ' pages updated.');