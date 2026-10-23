/*!
 * Bermuda Internship Board — embeddable listings for internshipinsightsco.com
 * Usage (Squarespace Code Block):
 *   <div id="iic-jobboard"></div>
 *   <script src="https://internshipinsights-jobs.netlify.app/embed.js" defer></script>
 * Options on the div: data-post-url="/opportunities" (link for employers).
 */
(function () {
  'use strict';
  if (window.__iicJobBoard) return;
  window.__iicJobBoard = true;

  var script = document.currentScript || (function () { var s = document.getElementsByTagName('script'); return s[s.length - 1]; })();
  var BASE = (script && script.src) ? script.src.replace(/embed\.js(\?.*)?$/, '') : 'https://internshipinsights-jobs.netlify.app/';
  var STUDENT_URL = 'https://students.internshipinsightsco.com/';

  var CSS = [
    '.iicjb{--o:#FBA856;--o6:#F08A25;--o50:#FFF5EA;--o9:#7A4810;--b:#5499BB;--b7:#3A7995;--b8:#2C6079;--b50:#EEF5F9;--burnt:#B54A14;--burnt1:#FBE9DC;--burnt9:#7A2F0A;--ink:#0E1A23;--line:#E3E9EC;--line2:#D3DCE1;--s50:#F4F7F8;--muted:rgba(14,26,35,.6);--sec:rgba(14,26,35,.72);',
    'font-family:Raleway,ui-sans-serif,system-ui,-apple-system,sans-serif;color:var(--ink);font-size:16px;line-height:1.55;text-align:left}',
    '.iicjb *,.iicjb *::before,.iicjb *::after{box-sizing:border-box}',
    '.iicjb button,.iicjb input,.iicjb select{font:inherit;color:inherit;margin:0}',
    '.iicjb a{color:inherit}',
    '.iicjb .f{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;padding:0 0 20px;border-bottom:1px solid var(--line);margin-bottom:24px}',
    '.iicjb .srch{position:relative;flex:1 1 280px;min-width:0}',
    '.iicjb .srch svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:18px;height:18px;color:var(--muted);pointer-events:none}',
    '.iicjb .srch input{width:100%;padding:12px 16px 12px 42px;font-size:15px;background:#fff;border:1px solid var(--line2);border-radius:10px;outline:none;transition:border-color .15s,box-shadow .15s}',
    '.iicjb .srch input:focus{border-color:var(--o);box-shadow:0 0 0 3px rgba(251,168,86,.45)}',
    '.iicjb .seg{display:inline-flex;background:#fff;border:1px solid var(--line2);border-radius:12px;padding:3px;flex-wrap:wrap}',
    '.iicjb .seg button{font-family:"Inter Tight",Raleway,sans-serif;font-weight:500;font-size:13px;color:var(--sec);background:transparent;border:0;border-radius:9px;padding:9px 14px;cursor:pointer;white-space:nowrap}',
    '.iicjb .seg button:hover{background:var(--b50);color:var(--ink)}',
    '.iicjb .seg button[aria-pressed=true]{background:var(--ink);color:#fff}',
    '.iicjb .seg .c{opacity:.7;margin-left:4px}',
    '.iicjb .chips{display:flex;flex-wrap:wrap;gap:8px;width:100%}',
    '.iicjb .chip{font-family:"Inter Tight",Raleway,sans-serif;font-weight:500;font-size:13px;background:#fff;border:1px solid var(--line2);border-radius:999px;padding:7px 14px;cursor:pointer}',
    '.iicjb .chip:hover{background:var(--b50)}',
    '.iicjb .chip[aria-pressed=true]{background:var(--o);border-color:var(--o);color:#000}',
    '.iicjb .row2{display:flex;flex-wrap:wrap;gap:12px;align-items:center}',
    '.iicjb .sel{appearance:none;-webkit-appearance:none;font-family:"Inter Tight",Raleway,sans-serif;font-weight:500;font-size:13px;background:#fff url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%230E1A23%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E") no-repeat right 10px center;border:1px solid var(--line2);border-radius:12px;padding:10px 34px 10px 14px;cursor:pointer}',
    '.iicjb .tg{display:inline-flex;align-items:center;gap:8px;font-family:"Inter Tight",Raleway,sans-serif;font-weight:500;font-size:13px;cursor:pointer;user-select:none}',
    '.iicjb .tg input{appearance:none;-webkit-appearance:none;width:36px;height:20px;border-radius:999px;background:var(--line2);position:relative;cursor:pointer;transition:background-color .15s}',
    '.iicjb .tg input::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(14,26,35,.15);transition:transform .15s}',
    '.iicjb .tg input:checked{background:var(--o)}.iicjb .tg input:checked::after{transform:translateX(16px)}',
    '.iicjb .hd{display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:20px}',
    '.iicjb .hd h2{margin:0;font-family:Raleway,sans-serif;font-weight:600;font-size:26px;letter-spacing:normal}',
    '.iicjb .hd p{margin:0;font-size:14px;color:var(--muted)}',
    '.iicjb .gt{margin:32px 0 16px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;color:var(--b7)}',
    '.iicjb .gt:first-of-type{margin-top:0}',
    '.iicjb .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}',
    '.iicjb .job{position:relative;display:flex;flex-direction:column;gap:12px;background:#fff;border:1px solid var(--line);border-radius:24px;box-shadow:0 2px 10px rgba(14,26,35,.05);padding:24px 24px 20px;transition:box-shadow .15s,border-color .15s}',
    '.iicjb .job:hover{box-shadow:0 10px 28px rgba(14,26,35,.10);border-color:rgba(14,26,35,.18)}',
    '.iicjb .bdg{display:flex;flex-wrap:wrap;gap:6px}',
    '.iicjb .b{display:inline-flex;align-items:center;border-radius:999px;padding:5px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;line-height:1.2}',
    '.iicjb .b-open{background:var(--o);color:var(--ink)}.iicjb .b-up{background:rgba(84,153,187,.15);color:var(--b8)}.iicjb .b-new{background:var(--ink);color:#fff}.iicjb .b-f{background:var(--s50);color:var(--sec)}.iicjb .b-soon{background:var(--burnt1);color:var(--burnt9)}',
    '.iicjb .top{display:flex;gap:12px;align-items:center}',
    '.iicjb .co{margin:0;font-weight:600;font-size:14px;color:var(--sec);line-height:1.35}',
    '.iicjb .av{position:relative;overflow:hidden;flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-weight:800;font-size:15px}',
    '.iicjb .av img{position:absolute;inset:0;margin:auto;width:28px;height:28px;object-fit:contain;opacity:0;transition:opacity .25s}',
    '.iicjb .av.ok{background:#fff;border:1px solid var(--line2)}.iicjb .av.ok img{opacity:1}.iicjb .av.ok .ini{visibility:hidden}',
    '.iicjb .a0{background:var(--b50);color:var(--b8)}.iicjb .a1{background:var(--o50);color:var(--o9)}.iicjb .a2{background:var(--s50);color:var(--ink)}.iicjb .a3{background:var(--ink);color:#fff}',
    '.iicjb .job h3{margin:-4px 0 0;font-family:Raleway,sans-serif;font-weight:600;font-size:20px;line-height:1.25;letter-spacing:normal}',
    '.iicjb .job h3 button{all:unset;cursor:pointer}',
    '.iicjb .job h3 button::after{content:"";position:absolute;inset:0;border-radius:24px}',
    '.iicjb .job h3 button:focus-visible{outline:none}.iicjb .job:has(h3 button:focus-visible){box-shadow:0 0 0 3px rgba(84,153,187,.45)}',
    '.iicjb .sum{margin:0;font-size:15px;line-height:1.6;color:var(--sec)}',
    '.iicjb .meta{list-style:none;margin:0;padding:12px 0 0;border-top:1px solid var(--line);display:grid;gap:6px;font-size:14px;line-height:1.45}',
    '.iicjb .meta li{display:grid;grid-template-columns:18px 1fr;gap:10px;align-items:start}',
    '.iicjb .meta svg{width:16px;height:16px;margin-top:2px;color:var(--b7)}',
    '.iicjb .ft{margin-top:auto;padding-top:12px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}',
    '.iicjb .dt{font-weight:700;font-size:14px}.iicjb .dt.soon{color:var(--burnt)}',
    '.iicjb .src{font-size:12px;color:var(--muted)}',
    '.iicjb .btn{position:relative;z-index:1;display:inline-flex;align-items:center;gap:8px;font-family:"Inter Tight",Raleway,sans-serif;font-weight:500;font-size:14px;line-height:1;padding:10px 16px;border-radius:10px;border:1px solid transparent;background:var(--o);color:#000;text-decoration:none;cursor:pointer;transition:background-color .15s,transform .15s}',
    '.iicjb .btn:hover{background:var(--o6);transform:translateY(-1px)}',
    '.iicjb .btn svg{width:15px;height:15px}',
    '.iicjb .btn-g{background:transparent;color:var(--b7)}.iicjb .btn-g:hover{background:var(--b50)}',
    '.iicjb .empty{text-align:center;background:#fff;border:1px dashed rgba(14,26,35,.2);border-radius:24px;padding:40px 24px}',
    '.iicjb .empty h3{margin:0 0 6px;font-weight:600;font-size:19px}.iicjb .empty p{margin:0 0 16px;color:var(--sec)}',
    '.iicjb .cta{margin-top:40px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}',
    '.iicjb .cta>div{border-radius:28px;padding:32px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}',
    '.iicjb .cta h3{margin:0;font-weight:500;font-size:28px;line-height:1.15;letter-spacing:normal}.iicjb .cta p{margin:0}',
    '.iicjb .cta .s{background:#D1DBE0}.iicjb .cta .e{background:linear-gradient(135deg,#3A7995,#2C6079);color:#fff}',
    '.iicjb .cta .btn{margin-top:auto}',
    'dialog.iicjb-d{width:min(720px,calc(100vw - 32px));max-height:calc(100vh - 48px);padding:0;border:0;border-radius:28px;box-shadow:0 24px 60px rgba(14,26,35,.28);background:#fff;overflow:auto}',
    'dialog.iicjb-d::backdrop{background:rgba(14,26,35,.55)}',
    '.iicjb-d .dh{position:relative;color:#fff;padding:24px 24px 20px;background:#222 url("https://images.squarespace-cdn.com/content/v1/67341669c76f8a207c0482bd/1780194575540-ZE73GSJOF7RLA4X6XXR3/unsplash-image-n95VMLxqM2I.jpg?format=1500w") center/cover}',
    '.iicjb-d .dh::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.6)}.iicjb-d .dh>*{position:relative}',
    '.iicjb-d .dh .av{width:52px;height:52px;background:rgba(255,255,255,.14);color:#fff}.iicjb-d .dh .av.ok{background:#fff;border-color:transparent}',
    '.iicjb-d .dh .co{color:rgba(255,255,255,.88);margin:12px 0 2px}',
    '.iicjb-d .dh h2{margin:0;font-family:Raleway,sans-serif;font-weight:500;font-size:clamp(22px,3vw,28px);line-height:1.2;padding-right:40px;color:#fff;letter-spacing:normal}',
    '.iicjb-d .dh .bdg{margin-top:14px}.iicjb-d .dh .b-f{background:rgba(255,255,255,.14);color:#fff}.iicjb-d .dh .b-up{background:rgba(255,255,255,.92)}',
    '.iicjb-d .x{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:999px;border:0;background:rgba(255,255,255,.16);color:#fff;display:grid;place-items:center;cursor:pointer}',
    '.iicjb-d .x svg{width:18px;height:18px}',
    '.iicjb-d .db{padding:24px;display:grid;gap:20px}.iicjb-d .db p{margin:0}',
    '.iicjb-d .lead{font-size:17px;line-height:1.65;color:var(--sec)}',
    '.iicjb-d .tl{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid var(--line2);border-radius:12px;overflow:hidden}',
    '.iicjb-d .tl li{padding:12px 14px}.iicjb-d .tl li+li{border-left:1px solid var(--line2)}.iicjb-d .tl li.now{background:var(--o50)}',
    '.iicjb-d .tl small{display:block;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted)}.iicjb-d .tl b{font-size:15px}',
    '.iicjb-d .fx{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0}',
    '.iicjb-d .fx div{background:#FBFAF7;border:1px solid var(--line2);border-radius:12px;padding:12px 14px}.iicjb-d .fx .w{grid-column:1/-1}',
    '.iicjb-d .fx dt{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--b7);margin-bottom:4px}.iicjb-d .fx dd{margin:0;font-weight:600;font-size:15px}',
    '.iicjb-d .prep{background:var(--b50);border-radius:12px;padding:16px 20px;color:var(--b8);font-size:15px}.iicjb-d .prep a{font-weight:700;color:var(--b8)}',
    '.iicjb-d .da{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;border-top:1px solid var(--line);padding:16px 24px;position:sticky;bottom:0;background:#fff}',
    '.iicjb-d .da .src{font-size:13px}.iicjb-d .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
    '@media (max-width:760px){.iicjb .grid,.iicjb .cta{grid-template-columns:1fr}.iicjb .seg{width:100%}.iicjb .seg button{flex:1;padding:9px 8px}.iicjb .job{padding:20px}}',
    '@media (max-width:560px){.iicjb-d .fx,.iicjb-d .tl{grid-template-columns:1fr}.iicjb-d .tl li+li{border-left:0;border-top:1px solid var(--line2)}}',
    '@media (prefers-reduced-motion:reduce){.iicjb *,.iicjb-d *{transition:none!important}}',
    /* Guard against the host site's theme styles (Squarespace sets h2/h3/button/link styles globally) */
    '#iic-jobboard button,#iic-jobboard input,#iic-jobboard select,dialog.iicjb-d.iicjb-d button{text-transform:none;letter-spacing:normal;text-shadow:none;min-height:0;line-height:1.2}',
    '#iic-jobboard .srch input{width:100%;height:auto;padding:12px 16px 12px 42px}',
    '#iic-jobboard .tg input{width:36px;height:20px;padding:0;border:0;flex:none}',
    '#iic-jobboard .seg button,#iic-jobboard .chip,#iic-jobboard .sel,#iic-jobboard .tg,#iic-jobboard .btn,dialog.iicjb-d.iicjb-d .btn{font-family:"Inter Tight",Raleway,ui-sans-serif,system-ui,sans-serif}',
    '#iic-jobboard h2,#iic-jobboard h3,dialog.iicjb-d.iicjb-d h2{font-family:Raleway,ui-sans-serif,system-ui,sans-serif;text-transform:none;color:inherit;letter-spacing:normal}',
    '#iic-jobboard .gt{font-family:Raleway,ui-sans-serif,system-ui,sans-serif;color:#3A7995;letter-spacing:.18em;text-transform:uppercase;font-size:12px;font-weight:700}',
    '#iic-jobboard .job h3{color:#0E1A23}#iic-jobboard .cta .e h3,#iic-jobboard .cta .e p{color:#fff}dialog.iicjb-d.iicjb-d h2{color:#fff}',
    '#iic-jobboard p,dialog.iicjb-d.iicjb-d p{font-family:Raleway,ui-sans-serif,system-ui,sans-serif}',
    '#iic-jobboard a.btn,dialog.iicjb-d.iicjb-d a.btn{color:#000;text-decoration:none;border-bottom:0}',
    '#iic-jobboard ul,#iic-jobboard ol,dialog.iicjb-d.iicjb-d ol{margin-left:0;padding-left:0}#iic-jobboard li,dialog.iicjb-d.iicjb-d li{margin:0}',
    'dialog.iicjb-d.iicjb-d .x{width:36px;padding:0}dialog.iicjb-d.iicjb-d .btn-g{color:#3A7995}'
  ].join('\n');

  var I = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'
  };
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DAY = 864e5;
  var STOP = { of: 1, the: 1, and: 1, '&': 1, for: 1, 'co.': 1, with: 1, '(with': 1, in: 1, on: 1, '—': 1 };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function parse(d) { if (!d) return null; var p = d.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) { return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); }
  function safe(u) { return /^(https?:\/\/|mailto:)/i.test(u || '') ? u : '#'; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function ini(c) {
    var w = String(c || '').split(/\s+/).filter(function (x) { return x && !STOP[x.toLowerCase()]; });
    if (!w.length) return '?';
    if (/^[A-Z]{2,4}$/.test(w[0])) return w[0];
    return (w[0][0] + (w[1] ? w[1][0] : '')).toUpperCase();
  }
  function avatar(j) {
    var img = j.domain ? '<img src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(j.domain) + '&sz=128" alt="" loading="lazy" data-logo data-domain="' + esc(j.domain) + '">' : '';
    return '<span class="av a' + (hash(j.company) % 4) + '" aria-hidden="true"><span class="ini">' + esc(ini(j.company)) + '</span>' + img + '</span>';
  }
  function wireLogos(root) {
    root.querySelectorAll('img[data-logo]').forEach(function (img) {
      var tried = false;
      function fail() { var d = img.getAttribute('data-domain'); if (!tried && d) { tried = true; img.src = 'https://icons.duckduckgo.com/ip3/' + encodeURIComponent(d) + '.ico'; } else img.remove(); }
      function check() { if (img.naturalWidth >= 24) img.parentNode.classList.add('ok'); else fail(); }
      img.addEventListener('load', check); img.addEventListener('error', fail);
      if (img.complete && img.naturalWidth) check();
    });
  }

  function start() {
    var mount = document.getElementById('iic-jobboard');
    if (!mount) { mount = document.createElement('div'); mount.id = 'iic-jobboard'; script.parentNode.insertBefore(mount, script); }
    var POST_URL = mount.getAttribute('data-post-url') || '/opportunities';
    var style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    if (!document.querySelector('link[data-iicjb-font]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.setAttribute('data-iicjb-font', '');
      l.href = 'https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600&family=Raleway:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(l);
    }
    mount.className = 'iicjb';
    mount.innerHTML = '<div class="empty"><h3>Loading internships…</h3><p>Bermuda’s internship opportunities, all in one place.</p></div>';

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var st = { q: '', status: 'all', field: '', loc: '', paid: false };
    var jobs = [], byId = {};
    var dlg = document.createElement('dialog'); dlg.className = 'iicjb-d iicjb'; document.body.appendChild(dlg);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    fetch(BASE + 'data/jobs.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(init)
      .catch(function () { mount.innerHTML = '<div class="empty"><h3>Listings didn’t load</h3><p>Refresh the page to try again.</p></div>'; });

    function init(data) {
      jobs = (data.jobs || []).map(function (j) {
        j._d = parse(j.deadline); j._o = parse(j.opens); j._a = parse(j.added);
        if (j.status === 'upcoming' && j._o && j._o <= today) j.status = 'open';
        j._x = !!(j._d && j._d < today);
        j._h = [j.title, j.company, j.field, j.location, j.season, j.eligibility, j.summary].join(' ').toLowerCase();
        return j;
      }).filter(function (j) { return !j._x; });
      jobs.forEach(function (j) { byId[j.id] = j; });
      var fields = [], locs = [];
      jobs.forEach(function (j) { if (fields.indexOf(j.field) < 0) fields.push(j.field); if (j.location && locs.indexOf(j.location) < 0) locs.push(j.location); });
      locs.sort();
      var open = jobs.filter(function (j) { return j.status === 'open'; }).length;

      mount.innerHTML =
        '<div class="f">' +
          '<label class="srch">' + I.search + '<input type="search" placeholder="Search by firm, role, field or eligibility" aria-label="Search internships" data-q></label>' +
          '<div class="seg" role="group" aria-label="Status">' +
            '<button type="button" data-s="all" aria-pressed="true">All<span class="c">' + jobs.length + '</span></button>' +
            '<button type="button" data-s="open" aria-pressed="false">Open now<span class="c">' + open + '</span></button>' +
            '<button type="button" data-s="upcoming" aria-pressed="false">Opening soon<span class="c">' + (jobs.length - open) + '</span></button>' +
          '</div>' +
          '<div class="chips" role="group" aria-label="Field"><button type="button" class="chip" data-fl="" aria-pressed="true">All fields</button>' +
            fields.map(function (f) { return '<button type="button" class="chip" data-fl="' + esc(f) + '" aria-pressed="false">' + esc(f) + '</button>'; }).join('') + '</div>' +
          '<div class="row2"><select class="sel" aria-label="Location" data-loc><option value="">All locations</option>' + locs.map(function (l) { return '<option>' + esc(l) + '</option>'; }).join('') + '</select>' +
          '<label class="tg"><input type="checkbox" data-paid> Paid only</label></div>' +
        '</div>' +
        '<div data-res></div>' +
        '<div class="cta">' +
          '<div class="s"><h3>Get ready before you apply</h3><p>Find out how ready you are for your first professional role with the free Future Ready Talent Framework self-assessment.</p><a class="btn" href="' + STUDENT_URL + '">Take the free assessment ' + I.out + '</a></div>' +
          '<div class="e"><h3>Are you hiring?</h3><p>Post your opportunity for free and put it in front of Bermuda’s students.</p><a class="btn" href="' + esc(POST_URL) + '">Post an internship ' + I.out + '</a></div>' +
        '</div>';

      mount.querySelector('[data-q]').addEventListener('input', function (e) { st.q = e.target.value.trim().toLowerCase(); render(); });
      mount.querySelector('[data-loc]').addEventListener('change', function (e) { st.loc = e.target.value; render(); });
      mount.querySelector('[data-paid]').addEventListener('change', function (e) { st.paid = e.target.checked; render(); });
      mount.querySelectorAll('[data-s]').forEach(function (b) { b.addEventListener('click', function () { st.status = b.getAttribute('data-s'); mount.querySelectorAll('[data-s]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
      mount.querySelectorAll('[data-fl]').forEach(function (b) { b.addEventListener('click', function () { st.field = b.getAttribute('data-fl'); mount.querySelectorAll('[data-fl]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); render(); }); });
      mount.addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (b) openDetail(byId[b.getAttribute('data-open')]); });
      render();
      var m = /^#job-(.+)$/.exec(location.hash); if (m && byId[m[1]]) openDetail(byId[m[1]]);
    }

    function byDate(k) { return function (a, b) { var x = a[k], y = b[k]; if (x && y) return x - y; if (x) return -1; if (y) return 1; return (b._a || 0) - (a._a || 0); }; }
    function badges(j) {
      var o = j.status === 'open';
      var s = '<span class="b ' + (o ? 'b-open">Open now' : 'b-up">Opening soon') + '</span>';
      if (j._a && (today - j._a) / DAY <= 2) s += '<span class="b b-new">New</span>';
      if (j._d && (j._d - today) / DAY <= 21) s += '<span class="b b-soon">Closing soon</span>';
      return s + '<span class="b b-f">' + esc(j.field) + '</span>';
    }
    function dline(j) { return j._d ? 'Apply by ' + fmt(j._d) : (j._o && j._o > today ? 'Opens ' + fmt(j._o) : (j.dateNote || '')); }

    function card(j) {
      var o = j.status === 'open', soon = j._d && (j._d - today) / DAY <= 21;
      var meta = '<li>' + I.cal + '<span>' + esc(j.season) + '</span></li><li>' + I.pin + '<span>' + esc(j.location) + '</span></li><li>' + I.user + '<span>' + esc(j.eligibility) + '</span></li>' + (j.paid === true ? '<li>' + I.wallet + '<span>Paid</span></li>' : '');
      return '<article class="job">' +
        '<div class="bdg">' + badges(j) + '</div>' +
        '<div class="top">' + avatar(j) + '<p class="co">' + esc(j.company) + '</p></div>' +
        '<h3><button type="button" data-open="' + esc(j.id) + '">' + esc(j.title) + '</button></h3>' +
        '<p class="sum">' + esc(j.summary) + '</p><ul class="meta">' + meta + '</ul>' +
        '<div class="ft"><div><div class="dt' + (soon ? ' soon' : '') + '">' + esc(dline(j)) + '</div><div class="src">Source: ' + esc(j.source) + '</div></div>' +
        '<a class="btn" href="' + esc(safe(j.url)) + '" target="_blank" rel="noopener">' + (o ? 'Apply' : 'View details') + I.out + '</a></div></article>';
    }

    function render() {
      var res = mount.querySelector('[data-res]');
      var list = jobs.filter(function (j) {
        if (st.status !== 'all' && j.status !== st.status) return false;
        if (st.field && j.field !== st.field) return false;
        if (st.loc && j.location !== st.loc) return false;
        if (st.paid && j.paid !== true) return false;
        if (st.q && j._h.indexOf(st.q) < 0) return false;
        return true;
      });
      var o = list.filter(function (j) { return j.status === 'open'; }).sort(byDate('_d'));
      var u = list.filter(function (j) { return j.status !== 'open'; }).sort(byDate('_o'));
      var h = '<div class="hd"><h2>' + list.length + (list.length === 1 ? ' internship' : ' internships') + '</h2><p>Soonest dates first · updated daily</p></div>';
      if (!list.length) { res.innerHTML = h + '<div class="empty"><h3>No internships match those filters</h3><p>Try a different word, or clear the filters to see everything.</p></div>'; return; }
      if (o.length) h += (u.length ? '<h3 class="gt">Open now</h3>' : '') + '<div class="grid">' + o.map(card).join('') + '</div>';
      if (u.length) h += (o.length ? '<h3 class="gt">Opening soon</h3>' : '') + '<div class="grid">' + u.map(card).join('') + '</div>';
      res.innerHTML = h; wireLogos(res);
    }

    function openDetail(j) {
      if (!j) return;
      var o = j.status === 'open';
      var s1 = j._o ? fmt(j._o) : (o ? 'Open now' : 'To be announced');
      var s2 = j._d ? fmt(j._d) : (/rolling|year-round/i.test(j.dateNote || '') ? 'Rolling' : 'Not stated');
      dlg.innerHTML =
        '<div class="dh"><button type="button" class="x" aria-label="Close">' + I.x + '</button>' + avatar(j) +
          '<p class="co">' + esc(j.company) + '</p><h2>' + esc(j.title) + '</h2><div class="bdg">' + badges(j) + '</div></div>' +
        '<div class="db"><p class="lead">' + esc(j.summary) + '</p>' +
          '<ol class="tl" aria-label="Key dates"><li class="' + (o ? 'now' : '') + '"><small>Applications open</small><b>' + esc(s1) + '</b></li><li><small>Deadline</small><b>' + esc(s2) + '</b></li><li><small>Internship</small><b>' + esc(j.season) + '</b></li></ol>' +
          '<dl class="fx"><div><dt>Location</dt><dd>' + esc(j.location) + '</dd></div><div><dt>Pay</dt><dd>' + (j.paid === true ? 'Paid' : j.paid === false ? 'Unpaid' : 'Not stated') + '</dd></div>' +
          '<div class="w"><dt>Who can apply</dt><dd>' + esc(j.eligibility) + '</dd></div>' + (j.dateNote ? '<div class="w"><dt>Timing</dt><dd>' + esc(j.dateNote) + '</dd></div>' : '') + '</dl>' +
          '<div class="prep">Before you apply, see how ready you are for your first professional role. <a href="' + STUDENT_URL + '" target="_blank" rel="noopener">Take the free FRTF self-assessment →</a></div></div>' +
        '<div class="da"><span class="src">Source: ' + esc(j.source) + '</span><div class="acts">' +
          '<button type="button" class="btn btn-g" data-copy>Copy link</button>' +
          '<a class="btn" href="' + esc(safe(j.url)) + '" target="_blank" rel="noopener">' + (o ? 'Apply on the original posting' : 'View programme details') + I.out + '</a></div></div>';
      wireLogos(dlg);
      dlg.querySelector('.x').addEventListener('click', function () { dlg.close(); });
      dlg.querySelector('[data-copy]').addEventListener('click', function (e) {
        var url = location.origin + location.pathname + '#job-' + j.id, b = e.currentTarget;
        function done() { b.textContent = 'Link copied'; setTimeout(function () { b.textContent = 'Copy link'; }, 2000); }
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { b.textContent = url; }); else b.textContent = url;
      });
      if (!dlg.open) dlg.showModal();
      dlg.scrollTop = 0;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
