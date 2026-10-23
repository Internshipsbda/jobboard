(function () {
  'use strict';

  var ICONS = {
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>'
  };

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DAY = 86400000;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function parse(d) { if (!d) return null; var p = d.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : '#'; }

  var today = new Date(); today.setHours(0, 0, 0, 0);
  var state = { q: '', status: 'all', field: 'All fields' };
  var jobs = [];

  var $ = function (id) { return document.getElementById(id); };
  document.getElementById('year').textContent = today.getFullYear();

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
      // An "upcoming" listing whose open date has passed is treated as open.
      if (j.status === 'upcoming' && j._opens && j._opens <= today) j.status = 'open';
      j._expired = !!(j._deadline && j._deadline < today);
      j._hay = [j.title, j.company, j.field, j.location, j.season, j.eligibility, j.summary].join(' ').toLowerCase();
      return j;
    }).filter(function (j) { return !j._expired; });

    var up = parse(data.updated);
    $('updated').textContent = up ? 'Updated ' + fmt(up) : 'Updated daily';

    var open = jobs.filter(function (j) { return j.status === 'open'; }).length;
    var upcoming = jobs.length - open;
    $('open-count').textContent = open;
    $('upcoming-count').textContent = upcoming;
    $('c-all').textContent = jobs.length;
    $('c-open').textContent = open;
    $('c-upcoming').textContent = upcoming;

    renderClosing();
    renderChips();
    bind();
    render();
  }

  function renderClosing() {
    var events = [];
    jobs.forEach(function (j) {
      if (j._deadline) events.push({ d: j._deadline, kind: 'Closes', j: j });
      if (j._opens && j._opens > today) events.push({ d: j._opens, kind: 'Opens', j: j });
    });
    events.sort(function (a, b) { return a.d - b.d; });
    var html = events.slice(0, 4).map(function (e) {
      return '<li><a href="#' + esc(e.j.id) + '">' +
        '<span class="closing-date"><small>' + e.kind + '</small>' + e.d.getDate() + ' ' + MONTHS[e.d.getMonth()] + '</span>' +
        '<span class="closing-what"><strong>' + esc(e.j.company) + '</strong>' + esc(e.j.title) + '</span></a></li>';
    }).join('');
    $('closing-list').innerHTML = html || '<li><a href="#listings"><span class="closing-date">—</span><span class="closing-what">No dated deadlines right now.</span></a></li>';
  }

  function renderChips() {
    var fields = ['All fields'];
    jobs.forEach(function (j) { if (fields.indexOf(j.field) < 0) fields.push(j.field); });
    $('chips').innerHTML = fields.map(function (f, i) {
      return '<button type="button" class="chip" data-field="' + esc(f) + '" aria-pressed="' + (i === 0) + '">' + esc(f) + '</button>';
    }).join('');
  }

  function bind() {
    $('q').addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); render(); });
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
      if (state.q && j._hay.indexOf(state.q) < 0) return false;
      return true;
    });

    var open = list.filter(function (j) { return j.status === 'open'; }).sort(byDate('_deadline'));
    var upcoming = list.filter(function (j) { return j.status !== 'open'; }).sort(byDate('_opens'));

    var head = '<div class="results-head"><h2>' + list.length + (list.length === 1 ? ' internship' : ' internships') + '</h2>' +
      '<p>Sorted by the soonest date</p></div>';

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
  }

  function reset() {
    state = { q: '', status: 'all', field: 'All fields' };
    $('q').value = '';
    document.querySelectorAll('[data-status]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-status') === 'all')); });
    $('chips').querySelectorAll('[data-field]').forEach(function (x, i) { x.setAttribute('aria-pressed', String(i === 0)); });
    render();
  }

  function card(j) {
    var isOpen = j.status === 'open';
    var badges = '<span class="badge ' + (isOpen ? 'badge-open">Open now' : 'badge-upcoming">Opening soon') + '</span>';
    if (j._added && (today - j._added) / DAY <= 2) badges += '<span class="badge badge-new">New</span>';
    var soon = j._deadline && (j._deadline - today) / DAY <= 21;
    if (soon) badges += '<span class="badge badge-urgent">Closing soon</span>';
    badges += '<span class="badge badge-field">' + esc(j.field) + '</span>';

    var dateLine;
    if (j._deadline) dateLine = 'Apply by ' + fmt(j._deadline);
    else if (j._opens && j._opens > today) dateLine = 'Opens ' + fmt(j._opens);
    else dateLine = j.dateNote || '';

    var meta = '<li>' + ICONS.calendar + '<span>' + esc(j.season) + '</span></li>' +
      '<li>' + ICONS.pin + '<span>' + esc(j.location) + '</span></li>' +
      '<li>' + ICONS.user + '<span>' + esc(j.eligibility) + '</span></li>';
    if (j.dateNote && j.dateNote !== dateLine) meta += '<li>' + ICONS.clock + '<span>' + esc(j.dateNote) + '</span></li>';
    if (j.paid === true) meta += '<li>' + ICONS.wallet + '<span>Paid</span></li>';

    return '<article class="job' + (isOpen ? '' : ' is-upcoming') + '" id="' + esc(j.id) + '">' +
      '<div class="badges">' + badges + '</div>' +
      '<p class="job-company">' + esc(j.company) + '</p>' +
      '<h3>' + esc(j.title) + '</h3>' +
      '<p class="job-summary">' + esc(j.summary) + '</p>' +
      '<ul class="meta">' + meta + '</ul>' +
      '<div class="job-foot">' +
        '<div><div class="job-date' + (soon ? ' is-soon' : '') + '">' + esc(dateLine) + '</div>' +
        '<div class="job-source">Source: ' + esc(j.source) + '</div></div>' +
        '<a class="btn btn-primary btn-sm" href="' + esc(safeUrl(j.url)) + '" target="_blank" rel="noopener">' +
          (isOpen ? 'View posting' : 'View details') + ICONS.out + '</a>' +
      '</div></article>';
  }
})();
