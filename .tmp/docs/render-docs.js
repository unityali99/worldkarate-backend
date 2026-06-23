const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s) {
  const tokens = [];
  s = s.replace(/`([^`]+)`/g, (_, v) => { tokens.push(`<code>${esc(v)}</code>`); return `\u0000${tokens.length - 1}\u0000`; });
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)]);
  return s;
}

function markdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  let out = '', paragraph = [], inCode = false, code = [], list = null, quote = [];
  const flushP = () => { if (paragraph.length) { out += `<p>${inline(paragraph.join(' '))}</p>\n`; paragraph = []; } };
  const flushList = () => { if (list) { out += `</${list}>\n`; list = null; } };
  const flushQuote = () => { if (quote.length) { out += `<blockquote>${quote.map(inline).join('<br>')}</blockquote>\n`; quote = []; } };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inCode) {
      if (line.startsWith('```')) { out += `<pre><code>${esc(code.join('\n'))}</code></pre>\n`; code = []; inCode = false; }
      else code.push(line);
      continue;
    }
    if (line.startsWith('```')) { flushP(); flushList(); flushQuote(); inCode = true; continue; }
    if (/^<\/?div\b/.test(line.trim())) { flushP(); flushList(); flushQuote(); out += line + '\n'; continue; }
    const hm = line.match(/^(#{1,6})\s+(.+)$/);
    if (hm) {
      flushP(); flushList(); flushQuote();
      const level = hm[1].length, raw = hm[2];
      const id = raw.toLowerCase().replace(/<[^>]+>/g, '').replace(/[`*_]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
      out += `<h${level} id="${id}">${inline(raw)}</h${level}>\n`;
      continue;
    }
    if (line.startsWith('> ')) { flushP(); flushList(); quote.push(line.slice(2)); continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      flushP(); flushQuote(); if (list !== 'ul') { flushList(); out += '<ul>\n'; list = 'ul'; }
      out += `<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>\n`; continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line) || /^[۰-۹]+[.)]\s+/.test(line)) {
      flushP(); flushQuote(); if (list !== 'ol') { flushList(); out += '<ol>\n'; list = 'ol'; }
      out += `<li>${inline(line.replace(/^\s*(?:\d+|[۰-۹]+)[.)]\s+/, ''))}</li>\n`; continue;
    }
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*:?-+/.test(lines[i + 1])) {
      flushP(); flushList(); flushQuote();
      const rows = [line]; i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) { rows.push(lines[i]); i++; }
      i--;
      const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
      out += '<table><thead><tr>' + cells(rows[0]).map(x => `<th>${inline(x)}</th>`).join('') + '</tr></thead><tbody>';
      for (const row of rows.slice(1)) out += '<tr>' + cells(row).map(x => `<td>${inline(x)}</td>`).join('') + '</tr>';
      out += '</tbody></table>\n'; continue;
    }
    if (!line.trim()) { flushP(); flushList(); flushQuote(); continue; }
    flushList(); flushQuote(); paragraph.push(line.trim().replace(/  $/, '<br>'));
  }
  flushP(); flushList(); flushQuote();
  return out;
}

function render(lang, source, output) {
  const rtl = lang === 'fa';
  let md = fs.readFileSync(path.join(root, source), 'utf8');
  md = md.replace(/^<div dir="rtl">\s*/m, '').replace(/\s*<\/div>\s*$/m, '');
  const titleLine = md.match(/^#\s+(.+)$/m)?.[1] || 'World Karate Backend';
  md = md.replace(/^#\s+.+\n/, '');
  const subtitle = rtl ? 'راهنمای جامع معماری، API، داده، امنیت و استقرار' : 'Complete architecture, API, data, security, and deployment guide';
  const edition = rtl ? 'نسخهٔ ۱٫۰ · بررسی‌شده بر اساس کد موجود · ژوئن ۲۰۲۶' : 'Edition 1.0 · Reviewed against the current codebase · June 2026';
  const html = `<!doctype html><html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${titleLine}</title><style>
    @page { size: A4; margin: 17mm 15mm 18mm; }
    @page:first { margin: 0; }
    :root { --ink:#173142; --muted:#56717f; --brand:#e9572f; --cyan:#087f9a; --paper:#fff; --soft:#edf5f7; }
    * { box-sizing:border-box; }
    html { font-size:10.4pt; }
    body { margin:0; color:var(--ink); font-family:${rtl ? "Tahoma, 'Segoe UI', Arial" : "'Segoe UI', Arial"}, sans-serif; line-height:1.63; background:var(--paper); }
    .cover { height:297mm; margin:-17mm -15mm -18mm; padding:34mm 24mm; color:white; background:linear-gradient(145deg,#071522 0%,#13394c 70%,#e9572f 160%); position:relative; overflow:hidden; page-break-after:always; }
    .cover:before,.cover:after { content:''; position:absolute; border-radius:50%; border:2px solid rgba(255,255,255,.1); }
    .cover:before { width:155mm;height:155mm;right:-65mm;top:-42mm;box-shadow:0 0 0 20mm rgba(8,127,154,.08),0 0 0 40mm rgba(8,127,154,.05); }
    .cover:after { width:110mm;height:110mm;left:-55mm;bottom:-38mm;box-shadow:0 0 0 17mm rgba(233,87,47,.08); }
    .kicker { color:#79d4e4; text-transform:uppercase; letter-spacing:.18em; font-weight:700; font-size:11pt; margin-top:28mm; }
    .cover h1 { font-size:36pt; line-height:1.15; margin:15mm 0 7mm; max-width:150mm; color:#fff; }
    .cover .subtitle { font-size:17pt; color:#d7edf2; max-width:135mm; }
    .cover .edition { position:absolute; bottom:28mm; ${rtl ? 'right' : 'left'}:24mm; color:#a9cbd4; font-size:10pt; }
    .accent { width:24mm;height:3px;background:var(--brand);margin-top:11mm; }
    main { max-width:100%; }
    h1,h2,h3,h4 { color:#102f40; line-height:1.25; break-after:avoid; }
    h2 { font-size:22pt; margin:10mm 0 4mm; padding-bottom:2.5mm; border-bottom:2px solid #d5e8ed; page-break-before:always; }
    h2:first-of-type { page-break-before:auto; }
    h3 { font-size:15pt; margin:7mm 0 2.5mm; color:#0b7288; }
    h4 { font-size:12pt; margin:5mm 0 2mm; color:#bd4527; }
    p { margin:0 0 3.2mm; orphans:3; widows:3; }
    a { color:#087f9a; text-decoration:none; }
    strong { color:#102f40; }
    code { direction:ltr; unicode-bidi:embed; font-family:Consolas,'Courier New',monospace; background:#eaf2f4; padding:.3mm 1.1mm; border-radius:3px; font-size:.9em; }
    pre { direction:ltr; text-align:left; background:#0d2736; color:#d9edf2; padding:4mm; border-radius:7px; overflow:hidden; break-inside:avoid; line-height:1.45; }
    pre code { background:none;color:inherit;padding:0;font-size:8.4pt;white-space:pre-wrap; }
    blockquote { margin:4mm 0 7mm; padding:4mm 5mm; color:#385866; background:#edf5f7; border-${rtl ? 'right' : 'left'}:4px solid var(--brand); border-radius:5px; }
    ul,ol { margin:2mm 0 4mm; padding-${rtl ? 'right' : 'left'}:7mm; }
    li { margin:1.2mm 0; }
    table { width:100%; border-collapse:collapse; margin:4mm 0 6mm; font-size:8.8pt; break-inside:auto; }
    tr { break-inside:avoid; }
    th { background:#12394b; color:white; font-weight:700; text-align:${rtl ? 'right' : 'left'}; }
    th,td { padding:2.2mm 2.5mm; border:1px solid #cddfe4; vertical-align:top; }
    tbody tr:nth-child(even) { background:#f1f7f8; }
    img { display:block; max-width:100%; max-height:238mm; margin:6mm auto 8mm; object-fit:contain; break-inside:avoid; }
    hr { border:0;border-top:1px solid #cddfe4;margin:9mm 0; }
    @media print { a { color:inherit; } }
  </style></head><body>
  <section class="cover"><div class="kicker">WORLD KARATE · BACKEND</div><h1>${titleLine}</h1><div class="subtitle">${subtitle}</div><div class="accent"></div><div class="edition">${edition}</div></section>
  <main>${markdown(md).replace(/src="diagrams\//g, 'src="../../docs/diagrams/')}</main></body></html>`;
  fs.writeFileSync(path.join(root, output), html);
}

render('en', 'docs/BACKEND_GUIDE_EN.md', '.tmp/docs/BACKEND_GUIDE_EN.html');
render('fa', 'docs/BACKEND_GUIDE_FA.md', '.tmp/docs/BACKEND_GUIDE_FA.html');
