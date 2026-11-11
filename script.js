(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  // 主题切换
  $('#themeToggle').addEventListener('click', function () {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // 移动端菜单
  var nav = $('#nav');
  $('#menuToggle').addEventListener('click', function (e) {
    e.stopPropagation();
    nav.classList.toggle('open');
  });
  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) nav.classList.remove('open');
  });

  // 导航高亮
  var links = $$('#nav a');
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateActive() {
    var offset = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= offset) current = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  // 滚动渐入
  var allSections = $$('.section');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    allSections.forEach(function (s) { io.observe(s); });
  } else {
    allSections.forEach(function (s) { s.classList.add('visible'); });
  }

  // News 展开/收起
  var newsList = $('#newsList');
  var newsToggle = $('#newsToggle');
  if (!$('.news-extra', newsList)) {
    newsToggle.style.display = 'none';
  } else {
    newsToggle.addEventListener('click', function () {
      var expanded = newsList.classList.toggle('expanded');
      newsToggle.textContent = expanded ? 'Show less' : 'Show more';
    });
  }

  // 论文筛选
  var pubs = $$('.pub');
  var chips = $$('.filters .chip');
  function applyFilter(f) {
    pubs.forEach(function (p) {
      var show =
        f === 'all' ||
        (f === 'selected' && p.dataset.selected === 'true') ||
        p.dataset.type === f;
      p.classList.toggle('hidden', !show);
    });
    chips.forEach(function (c) { c.classList.toggle('active', c.dataset.filter === f); });
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () { applyFilter(c.dataset.filter); });
  });
  applyFilter('selected');

  // BibTeX 展开与复制
  $$('.pub').forEach(function (pub) {
    var btn = $('.bib-toggle', pub);
    var bib = $('.bibtex', pub);
    if (!btn || !bib) return;

    var raw = bib.textContent.trim();
    var copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy';
    bib.appendChild(copyBtn);

    btn.addEventListener('click', function () {
      var open = bib.classList.toggle('open');
      btn.classList.toggle('active', open);
    });
    copyBtn.addEventListener('click', function () {
      copyText(raw).then(function () { toast('BibTeX copied'); }, function () { toast('Copy failed'); });
    });
  });

  // 复制邮箱
  var copyEmail = $('#copyEmail');
  if (copyEmail) {
    copyEmail.addEventListener('click', function () {
      copyText(copyEmail.dataset.email).then(function () { toast('Email copied'); }, function () { toast('Copy failed'); });
    });
  }

  $('#year').textContent = new Date().getFullYear();
})();
