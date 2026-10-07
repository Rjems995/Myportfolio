const fs = require('node:fs');
const path = require('node:path');
const raw = process.argv[2];
let site;
try {
  site = new URL(raw);
  if (
    site.protocol !== 'https:' ||
    site.username ||
    site.password ||
    site.search ||
    site.hash
  )
    throw new Error();
} catch {
  console.error(
    'Provide the public HTTPS site URL without credentials, query, or fragment.',
  );
  process.exit(1);
}
if (!site.pathname.endsWith('/')) site.pathname += '/';
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;');
const file = path.resolve(__dirname, '../index.html');
let html = fs.readFileSync(file, 'utf8');
for (const [attribute, name, value] of [
  ['property', 'og:url', site.href],
  ['property', 'og:image', new URL('assets/social-preview.png', site).href],
  ['name', 'twitter:image', new URL('assets/social-preview.png', site).href],
]) {
  const tag = `<meta ${attribute}="${name}" content="${escape(value)}" />`;
  const pattern = new RegExp(`<meta\\s+${attribute}="${name}"[^>]*>`, 'g');
  html = pattern.test(html)
    ? html.replace(pattern, () => tag)
    : html.replace('</head>', `${tag}\n  </head>`);
}
const canonical = `<link rel="canonical" href="${escape(site.href)}" />`;
html = /<link\s+rel="canonical"[^>]*>/.test(html)
  ? html.replace(/<link\s+rel="canonical"[^>]*>/, () => canonical)
  : html.replace('</head>', `${canonical}\n  </head>`);
fs.writeFileSync(file, html);
console.log(
  `Sharing URLs set to ${site.href}. Run npm run format before committing.`,
);
