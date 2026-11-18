// Netlify build: copies the static site into dist/ and generates SEO files.
// - dist/internships/<id>/index.html : one indexable page per listing
//   (Google for Jobs "JobPosting" markup only on listings that are open now)
// - dist/sitemap.xml, dist/robots.txt
// - a crawlable list of listing links injected into index.html (app.js replaces it on load)
// No dependencies. Run locally with: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://jobboard.internshipinsightsco.com';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist');

const COPY = ['index.html', 'post.html', 'thanks.html', 'app.js', 'embed.js', 'styles.css', 'assets', 'fonts', 'data'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of COPY) {
  const src = path.join(root, f);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(out, f), { recursive: true });
}

const data = JSON.parse(fs.readFileSync(path.join(root, 'data/jobs.json'), 'utf8'));
const jobs = data.jobs || [];

// Today in Bermuda (Atlantic/Bermuda), as YYYY-MM-DD
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Atlantic/Bermuda', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const fmt = (d) => { if (!d) return null; const [y, m, dd] = d.split('-').map(Number); return `${dd} ${MONTHS[m - 1]} ${y}`; };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = (u) => (/^(https?:|mailto:)/i.test(u || '') ? u : '#');

function statusOf(j) {
  if (j.status === 'closed' || (j.deadline && j.deadline < today)) return 'closed';
  if (j.status === 'upcoming' && j.opens && j.opens <= today) return 'open';
  return j.status === 'open' ? 'open' : 'upcoming';
}
const LABEL = { open: 'Open now', upcoming: 'Opening soon', closed: 'Closed' };
const pageUrl = (j) => `${SITE}/internships/${encodeURIComponent(j.id)}/`;

// Shared header/footer, taken from index.html so the pages always match the board
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const header = indexHtml.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]
  .replace(/href="index\.html"/g, 'href="/"').replace(/href="post\.html"/g, 'href="/post.html"')
  .replace(/src="assets\//g, 'src="/assets/').replace(' aria-current="page"', '');
const footer = indexHtml.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0]
  .replace(/href="index\.html"/g, 'href="/"').replace(/href="post\.html"/g, 'href="/post.html"');
const headCommon = indexHtml.match(/<link rel="icon"[\s\S]*?<link rel="stylesheet" href="styles\.css">/)[0]
  .replace(/href="assets\//g, 'href="/assets/').replace('href="styles.css"', 'href="/styles.css"');

function jobPostingLd(j) {
  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: j.title,
    description: `<p>${esc(j.summary)}</p><p><strong>Who can apply:</strong> ${esc(j.eligibility)}</p>` +
      (j.dateNote ? `<p><strong>Timing:</strong> ${esc(j.dateNote)}</p>` : '') + `<p><strong>Internship:</strong> ${esc(j.season)}</p>`,
    datePosted: j.added,
    employmentType: 'INTERN',
    hiringOrganization: { '@type': 'Organization', name: j.company, ...(j.domain ? { sameAs: `https://${j.domain}` } : {}) },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: j.location || 'Bermuda', addressCountry: 'BM' } },
    directApply: false,
    url: pageUrl(j),
  };
  if (j.deadline) ld.validThrough = `${j.deadline}T23:59:59-04:00`;
  return ld;
}

function jobPage(j) {
  const st = statusOf(j);
  const title = `${j.title}, ${j.company} | Bermuda Internship Board`;
  const desc = `${LABEL[st]}: ${j.title} at ${j.company} in Bermuda. ${j.summary}`.slice(0, 300).replace(/\s+\S*$/, '') + '…';
  const opens = j.opens ? fmt(j.opens) : st === 'open' ? 'Open now' : st === 'closed' ? 'Closed for this round' : 'To be announced';
  const closes = j.deadline ? fmt(j.deadline) : st === 'closed' ? 'Closed' : /rolling|year-round/i.test(j.dateNote || '') ? 'Rolling' : 'Not stated';
  const pay = j.paid === true ? 'Paid' : j.paid === false ? 'Unpaid' : 'Not stated';
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Bermuda Internship Board', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: `${j.title}, ${j.company}`, item: pageUrl(j) }] };
  const lds = [breadcrumb];
  if (st === 'open') lds.push(jobPostingLd(j));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${pageUrl(j)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Bermuda Internship Board">
  <meta property="og:title" content="${esc(`${j.title}, ${j.company}`)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${pageUrl(j)}">
  <meta property="og:image" content="${SITE}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  ${headCommon}
${lds.map((l) => `  <script type="application/ld+json">${JSON.stringify(l).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="employer">
  ${header}
  <main>
    <section class="page-head hire-head photo-hero job-head">
      <div class="wrap">
        <a class="back" href="/#listings">← All Bermuda internships</a>
        <p class="kicker">${esc(j.company)}</p>
        <h1>${esc(j.title)}</h1>
        <div class="badges"><span class="badge badge-${st === 'open' ? 'open' : st === 'closed' ? 'closed' : 'upcoming'}">${LABEL[st]}</span><span class="badge badge-field">${esc(j.field)}</span></div>
      </div>
      <svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0,72 C220,8 470,6 720,52 C980,100 1210,104 1440,36 L1440,120 L0,120 Z"/></svg>
    </section>
    <div class="job-page"><div class="wrap">
      <article class="job-page-card${st === 'closed' ? ' is-closed' : ''}">
        <p class="summary">${esc(j.summary)}</p>
        <ol class="timeline" aria-label="Key dates">
          <li><small>Applications open</small><b>${esc(opens)}</b></li>
          <li><small>Deadline</small><b>${esc(closes)}</b></li>
          <li><small>Internship</small><b>${esc(j.season)}</b></li>
        </ol>
        <dl class="facts">
          <div class="fact"><dt>Location</dt><dd>${esc(j.location)}, Bermuda</dd></div>
          <div class="fact"><dt>Pay</dt><dd>${pay}</dd></div>
          <div class="fact wide"><dt>Who can apply</dt><dd>${esc(j.eligibility)}</dd></div>
          ${st === 'closed' ? '<div class="fact wide"><dt>Next year</dt><dd>Applications have closed for this round. Check back around the same time next year, and keep an eye on the employer’s careers page.</dd></div>' : ''}
          ${j.dateNote ? `<div class="fact wide"><dt>Timing</dt><dd>${esc(j.dateNote)}</dd></div>` : ''}
        </dl>
        <div class="job-page-actions">
          <a class="btn btn-primary" href="${esc(safeUrl(j.url))}" target="_blank" rel="noopener">${st === 'open' ? 'Apply on the original posting' : 'View programme details'} →</a>
          <span class="src">Source: ${esc(j.source)}</span>
        </div>
        <div class="prep"><p>Before you apply, see how ready you are for your first professional role. <a href="https://students.internshipinsightsco.com/" target="_blank" rel="noopener">Take the free FRTF self-assessment →</a></p></div>
      </article>
    </div></div>
  </main>
  ${footer}
</body>
</html>
`;
}

for (const j of jobs) {
  const dir = path.join(out, 'internships', j.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), jobPage(j));
}

// Crawlable links on the board itself (app.js overwrites #results once listings load)
const order = { open: 0, upcoming: 1, closed: 2 };
const sorted = [...jobs].sort((a, b) => order[statusOf(a)] - order[statusOf(b)]);
const list = '<div class="seo-list"><h2>Bermuda internships</h2><ul>' +
  sorted.map((j) => `<li><a href="/internships/${esc(j.id)}/">${esc(j.title)}, ${esc(j.company)}</a> (${LABEL[statusOf(j)]})</li>`).join('') + '</ul></div>';
const index = fs.readFileSync(path.join(out, 'index.html'), 'utf8').replace('<div class="wrap" id="results"></div>', `<div class="wrap" id="results">${list}</div>`);
fs.writeFileSync(path.join(out, 'index.html'), index);

// Sitemap + robots
const urls = [{ loc: `${SITE}/`, lastmod: data.updated }, { loc: `${SITE}/post.html` }]
  .concat(jobs.map((j) => ({ loc: pageUrl(j), lastmod: data.updated || j.added })));
fs.writeFileSync(path.join(out, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /thanks.html\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Built ${jobs.length} listing pages (${jobs.filter((j) => statusOf(j) === 'open').length} with JobPosting markup) into dist/`);
