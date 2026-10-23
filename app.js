(function () {
  'use strict';

  var ICONS = {
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY = 86400000;
  var STOP = { of: 1, the: 1, and: 1, '&': 1, for: 1, 'co.': 1, with: 1, '(with': 1, in: 1, on: 1 };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parse(d) { if (!d) return null; var p = d.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function safeUrl(u) { return /^(https?:\/\/|mailto:)/i.test(u || '') ? u : '#'; }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

  function initials(company) {
    var words = String(company || '').split(/\s+/).filter(function (w) { return w && !STOP[w.toLowerCase()]; });
    if (!words.length) return '?';
    if (/^[A-Z]{2,4}$/.test(words[0])) return words[0];
    return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase();
  }

  function avatar(j, extra) {
    var cls = 'avatar av-' + (hash(j.company) % 4) + (extra ? ' ' + extra : '');
    var img = j.domain
      ? '<img src="https://www.google.com/s2/favicons?domain=' + encodeURIComponent(j.domain) + '&sz=128" alt="" loading="lazy" data-logo>'
      : '';
    return '<span class="' + cls + '" aria-hidden="true"><span class="initials">' + esc(initials(j.company)) + '</span>' + img + '</span>';
  }

  // Show a logo only when the employer has a real one; otherwise keep the monogram.
  function wireLogos(root) {
    root.querySelectorAll('img[data-logo]').forEach(function (img) {
      function ok() { if (img.naturalWidth >= 32) img.parentNode.classList.add('has-logo'); else img.remove(); }
      if (img.complete && img.naturalWidth) ok();
      else { img.addEventListener('load', ok); img.addEventListener('error', function () { img.remove(); }); }
    });
  }

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var state = { q: '', status: 'all', field: 'All fields', loc: '', paid: false };
  var jobs = [];
  var byId = {};
  var lastFocus = null;

  var $ = function (id) { return document.getElementById(id); };
  $('year').textContent = today.getFullYear();
  var dialog = $('detail');

  fetch('data/jobs.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(init)
    .catch(function () {
      $('results').innerHTML = '<div class="empty"><h3>Listings didn’t load</h3><p>Refresh the page to try again.</p></div>';
    });

  function init(data) {
    jobs = (data.jobs || []).map(function (j) {
      j._deadline = parse(j.deadline);
      j._opens = parse(j.opens);
      j._added = parse(j.added);
      if (j.status === 'upcoming' && j._opens && j._opens <= today) j.status = 'open';
      j._expired = !!(j._deadline && j._deadline < today);
      j._hay = [j.title, j.company, j.field, j.location, j.season, j.eligibility, j.summary].join(' ').toLowerCase();
      return j;
    }).filter(function (j) { return !j._expired; });
    jobs.forEach(function (j) { byId[j.id] = j; });

    var up = parse(data.updated);
    $('updated').textContent = up ? 'Updated ' + fmt(up) : 'Updated daily';

    var open = jobs.filter(function (j) { return j.status === 'open'; }).length;
    $('open-count').textContent = open;
    $('upcoming-count').textContent = jobs.length - open;
    $('c-all').textContent = jobs.length;
    $('c-open').textContent = open;
    $('c-upcoming').textContent = jobs.length - open;

    renderClosing();
    renderChips();
    renderLocations();
    bind();
    render();
    route();
  }

  function renderClosing() {
    var events = [];
    jobs.forEach(function (j) {
      if (j._deadline) events.push({ d: j._deadline, kind: 'Closes', j: j });
      if (j._opens && j._opens > today) events.push({ d: j._opens, kind: 'Opens', j: j });
    });
    events.sort(function (a, b) { return a.d - b.d; });
    $('closing-list').innerHTML = events.slice(0, 4).map(function (e) {
      return '<li><a href="#job/' + esc(e.j.id) + '">' +
        '<span class="closing-date"><small>' + e.kind + '</small>' + e.d.getDate() + ' ' + MONTHS[e.d.getMonth()] + '</span>' +
        '<span class="closing-what"><strong>' + esc(e.j.company) + '</strong>' + esc(e.j.title) + '</span></a></li>';
    }).join('') || '<li><a href="#listings"><span class="closing-date">—</span><span class="closing-what">No dated deadlines right now.</span></a></li>';
  }

  function renderChips() {
    var fields = ['All fields'];
    jobs.forEach(function (j) { if (fields.indexOf(j.field) < 0) fields.push(j.field); });
    $('chips').innerHTML = fields.map(function (f, i) {
      return '<button type="button" class="chip" data-field="' + esc(f) + '" aria-pressed="' + (i === 0) + '">' + esc(f) + '</button>';
    }).join('');
  }

  function renderLocations() {
    var locs = [];
    jobs.forEach(function (j) { if (j.location && locs.indexOf(j.location) < 0) locs.push(j.location); });
    locs.sort();
    $('loc').insertAdjacentHTML('beforeend', locs.map(function (l) { return '<option>' + esc(l) + '</option>'; }).join(''));
  }

  function bind() {
    $('q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
    $('loc').addEventListener('change', function (e) { state.loc = e.target.value; render(); });
    $('paid').addEventListener('change', function (e) { state.paid = e.target.checked; render(); });
    document.querySelectorAll('[data-status]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.status = b.getAttribute('data-status');
        document.querySelectorAll('[data-status]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        render();
      });
    });
    $('chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-field]'); if (!b) return;
      state.field = b.getAttribute('data-field');
      $('chips').querySelectorAll('[data-field]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      render();
    });
    window.addEventListener('hashchange', route);
    dialog.addEventListener('close', function () {
      if (/^#job\//.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
      if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  }

  function byDate(key) {
    return function (a, b) {
      var x = a[key], y = b[key];
      if (x && y) return x - y;
      if (x) return -1;
      if (y) return 1;
      return (b._added || 0) - (a._added || 0);
    };
  }

  function render() {
    var list = jobs.filter(function (j) {
      if (state.status !== 'all' && j.status !== state.status) return false;
      if (state.field !== 'All fields' && j.field !== state.field) return false;
      if (state.loc && j.location !== state.loc) return false;
      if (state.paid && j.paid !== true) return false;
      if (state.q && j._hay.indexOf(state.q) < 0) return false;
      return true;
    });

    var open = list.filter(function (j) { return j.status === 'open'; }).sort(byDate('_deadline'));
    var upcoming = list.filter(function (j) { return j.status !== 'open'; }).sort(byDate('_opens'));

    var head = '<div class="results-head"><h2>' + list.length + (list.length === 1 ? ' internship' : ' internships') + '</h2>' +
      '<p>Soonest dates first</p></div>';

    if (!list.length) {
      $('results').innerHTML = head + '<div class="empty"><h3>No internships match those filters</h3>' +
        '<p>Try a different word, or clear the filters to see everything.</p>' +
        '<button type="button" class="btn btn-outline btn-sm" id="reset">Clear filters</button></div>';
      $('reset').addEventListener('click', reset);
      return;
    }

    var html = head;
    if (open.length) html += (upcoming.length ? '<h3 class="group-title">Open now</h3>' : '') + '<div class="grid">' + open.map(card).join('') + '</div>';
    if (upcoming.length) html += (open.length ? '<h3 class="group-title">Opening soon</h3>' : '') + '<div class="grid">' + upcoming.map(card).join('') + '</div>';
    $('results').innerHTML = html;
    wireLogos($('results'));
  }

  function reset() {
    state = { q: '', status: 'all', field: 'All fields', loc: '', paid: false };
    $('q').value = ''; $('loc').value = ''; $('paid').checked = false;
    document.querySelectorAll('[data-status]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-status') === 'all')); });
    $('chips').querySelectorAll('[data-field]').forEach(function (x, i) { x.setAttribute('aria-pressed', String(i === 0)); });
    render();
  }

  function badgesFor(j) {
    var isOpen = j.status === 'open';
    var b = '<span class="badge ' + (isOpen ? 'badge-open">Open now' : 'badge-upcoming">Opening soon') + '</span>';
    if (j._added && (today - j._added) / DAY <= 2) b += '<span class="badge badge-new">New</span>';
    if (j._deadline && (j._deadline - today) / DAY <= 21) b += '<span class="badge badge-urgent">Closing soon</span>';
    return b;
  }

  function dateLineFor(j) {
    if (j._deadline) return 'Apply by ' + fmt(j._deadline);
    if (j._opens && j._opens > today) return 'Opens ' + fmt(j._opens);
    return j.dateNote || '';
  }

  function card(j) {
    var isOpen = j.status === 'open';
    var soon = j._deadline && (j._deadline - today) / DAY <= 21;
    var dateLine = dateLineFor(j);

    var meta = '<li>' + ICONS.calendar + '<span>' + esc(j.season) + '</span></li>' +
      '<li>' + ICONS.pin + '<span>' + esc(j.location) + '</span></li>' +
      '<li>' + ICONS.user + '<span>' + esc(j.eligibility) + '</span></li>';
    if (j.paid === true) meta += '<li>' + ICONS.wallet + '<span>Paid</span></li>';

    return '<article class="job' + (isOpen ? '' : ' is-upcoming') + '" id="' + esc(j.id) + '">' +
      '<div class="badges">' + badgesFor(j) + '<span class="badge badge-field">' + esc(j.field) + '</span></div>' +
      '<div class="job-top">' + avatar(j) + '<p class="job-company">' + esc(j.company) + '</p></div>' +
      '<h3><a href="#job/' + esc(j.id) + '">' + esc(j.title) + '</a></h3>' +
      '<p class="job-summary">' + esc(j.summary) + '</p>' +
      '<ul class="meta">' + meta + '</ul>' +
      '<div class="job-foot">' +
        '<div><div class="job-date' + (soon ? ' is-soon' : '') + '">' + esc(dateLine) + '</div>' +
        '<div class="job-source">Source: ' + esc(j.source) + '</div></div>' +
        '<a class="btn btn-primary btn-sm" href="' + esc(safeUrl(j.url)) + '" target="_blank" rel="noopener">' +
          (isOpen ? 'Apply' : 'View details') + ICONS.out + '</a>' +
      '</div></article>';
  }

  // ---------- Detail view (shareable via #job/<id>) ----------
  function route() {
    var m = /^#job\/(.+)$/.exec(location.hash);
    if (!m) { if (dialog.open) dialog.close(); return; }
    var j = byId[decodeURIComponent(m[1])];
    if (!j) return;
    if (!dialog.open) lastFocus = document.activeElement;
    openDetail(j);
  }

  function openDetail(j) {
    var isOpen = j.status === 'open';
    var stepOpen = j._opens ? fmt(j._opens) : (isOpen ? 'Open now' : 'To be announced');
    var stepClose = j._deadline ? fmt(j._deadline) : (j.dateNote && /rolling|year-round/i.test(j.dateNote) ? 'Rolling' : 'Not stated');

    dialog.innerHTML =
      '<div class="detail-head">' +
        '<button type="button" class="close" aria-label="Close">' + ICONS.x + '</button>' +
        avatar(j) +
        '<p class="co">' + esc(j.company) + '</p>' +
        '<h2 id="d-title">' + esc(j.title) + '</h2>' +
        '<div class="badges">' + badgesFor(j) + '<span class="badge badge-field">' + esc(j.field) + '</span></div>' +
      '</div>' +
      '<div class="detail-body">' +
        '<p class="summary">' + esc(j.summary) + '</p>' +
        '<ol class="timeline" aria-label="Key dates">' +
          '<li class="' + (isOpen ? 'now' : '') + '"><small>Applications open</small><b>' + esc(stepOpen) + '</b></li>' +
          '<li class="' + (j._deadline && isOpen ? 'now' : '') + '"><small>Deadline</small><b>' + esc(stepClose) + '</b></li>' +
          '<li><small>Internship</small><b>' + esc(j.season) + '</b></li>' +
        '</ol>' +
        '<dl class="facts">' +
          '<div class="fact"><dt>Location</dt><dd>' + esc(j.location) + '</dd></div>' +
          '<div class="fact"><dt>Pay</dt><dd>' + (j.paid === true ? 'Paid' : j.paid === false ? 'Unpaid' : 'Not stated') + '</dd></div>' +
          '<div class="fact wide"><dt>Who can apply</dt><dd>' + esc(j.eligibility) + '</dd></div>' +
          (j.dateNote ? '<div class="fact wide"><dt>Timing</dt><dd>' + esc(j.dateNote) + '</dd></div>' : '') +
        '</dl>' +
        '<div class="prep"><p>Before you apply, see how ready you are for your first professional role. <a href="https://students.internshipinsightsco.com/" target="_blank" rel="noopener">Take the free FRTF self-assessment →</a></p></div>' +
      '</div>' +
      '<div class="detail-actions">' +
        '<span class="src">Source: ' + esc(j.source) + '</span>' +
        '<div class="foot-actions">' +
          '<button type="button" class="btn btn-ghost btn-sm" id="copy">' + ICONS.link + '<span>Copy link</span></button>' +
          '<a class="btn btn-primary" href="' + esc(safeUrl(j.url)) + '" target="_blank" rel="noopener">' + (isOpen ? 'Apply on the original posting' : 'View programme details') + ICONS.out + '</a>' +
        '</div>' +
      '</div>';

    wireLogos(dialog);
    dialog.querySelector('.close').addEventListener('click', function () { dialog.close(); });
    $('copy').addEventListener('click', function () {
      var url = location.origin + location.pathname + '#job/' + encodeURIComponent(j.id);
      var label = $('copy').querySelector('span');
      function done() { label.textContent = 'Link copied'; setTimeout(function () { label.textContent = 'Copy link'; }, 2000); }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { label.textContent = url; });
      else label.textContent = url;
    });
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }
})();
