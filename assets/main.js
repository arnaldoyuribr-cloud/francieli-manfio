(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  /* ---------- Abertura com a logo ---------- */
  var loader = document.querySelector('.loader');
  var introMs = reduce ? 600 : 2500;
  var startReveal;
  if (loader) {
    body.classList.add('is-loading');
    setTimeout(function () {
      body.classList.remove('is-loading');
      if (startReveal) startReveal();
    }, introMs + 300);
    loader.addEventListener('animationend', function (e) {
      if (e.animationName === 'loaderOut') loader.remove();
    });
  }

  /* ---------- Menu ---------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('menu');

  window.addEventListener('scroll', function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }, { passive: true });

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Mostra a seção de depoimentos só quando houver algum
  var dep = document.getElementById('depoimentos');
  if (dep && dep.querySelector('.testi')) dep.hidden = false;

  /* ---------- Revelar ao rolar (começa depois da abertura) ---------- */
  var els = document.querySelectorAll('.reveal');
  function reveal() {
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  if (loader) startReveal = reveal; else reveal();

  document.getElementById('ano').textContent = new Date().getFullYear();

  /* ---------- Cursor animado ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var dot = document.querySelector('.cursor');
  var ring = document.querySelector('.cursor-ring');
  if (!fine || reduce || !dot || !ring) return;

  var mx = -100, my = -100, rx = -100, ry = -100, scale = 1, target = 1, started = false;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!started) { started = true; rx = mx; ry = my; document.documentElement.classList.add('has-cursor'); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { document.documentElement.classList.remove('has-cursor'); started = false; });
  document.addEventListener('mousedown', function () { target = 0.8; });
  document.addEventListener('mouseup', function () { target = 1; });

  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    var onView = t.closest('.proj, .hero__img, .split__img');
    var onLink = !onView && t.closest('a, button');
    var onDark = t.closest('.contact, .footer, .loader');
    ring.classList.toggle('is-view', !!onView);
    ring.classList.toggle('is-link', !!onLink);
    ring.classList.toggle('is-light', !!onDark && !onView);
    dot.classList.toggle('is-light', !!onDark);
    dot.style.opacity = onView ? '0' : '';
  });

  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    scale += (target - scale) * 0.2;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) scale(' + scale + ')';
    requestAnimationFrame(loop);
  })();
})();
