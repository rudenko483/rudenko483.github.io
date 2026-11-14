(() => {
  const source = document.currentScript;
  const slug = source.dataset.project;
  const motionAllowed = matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const mobile = document.querySelector('.pf-mobile');
  const hero = document.querySelector('.hero');
  if ('IntersectionObserver' in window) {
    if (motionAllowed) {
      const enter = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('pf-in');
        enter.unobserve(entry.target);
      }), { threshold: 0.1 });
      document.querySelectorAll('.pf-section').forEach(section => enter.observe(section));
    }
    if (mobile && hero) {
      const visibility = new IntersectionObserver(([entry]) => {
        if (document.activeElement !== mobile) mobile.hidden = entry.isIntersecting;
      });
      visibility.observe(hero);
    }
  }

  const trigger = document.querySelector('[data-portfolio-map]');
  if (trigger) {
    trigger.hidden = false;
    trigger.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.className = 'pf-map';
      iframe.title = 'Карта Калининграда для примера';
      iframe.referrerPolicy = 'no-referrer';
      iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=20.32%2C54.65%2C20.59%2C54.77&layer=mapnik';
      trigger.replaceWith(iframe);
      iframe.focus();
    }, { once: true });
  }

  const id = source.dataset.analyticsId;
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const key = slug + '-analytics-consent';
  let consent;
  try { consent = localStorage.getItem(key); } catch {}
  const start = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', id);
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(tag);
  };
  const choice = value => {
    try { localStorage.setItem(key, value); location.reload(); }
    catch { document.querySelector('.pf-consent')?.remove(); if (value === 'allowed') start(); }
  };
  if (consent === 'allowed') start();
  const toggle = document.querySelector('[data-portfolio-analytics-toggle]');
  if (toggle) {
    toggle.hidden = false;
    toggle.textContent = consent === 'allowed' ? 'Отключить аналитику' : 'Разрешить аналитику';
    toggle.addEventListener('click', () => choice(consent === 'allowed' ? 'denied' : 'allowed'));
    document.querySelector('[data-portfolio-analytics-status]').textContent =
      consent === 'allowed' ? 'Вы разрешили Google Analytics.' : 'Google Analytics загружается с вашего согласия.';
  }
  if (consent) return;
  const banner = document.createElement('aside');
  banner.className = 'pf-consent';
  banner.setAttribute('aria-label', 'Настройки аналитики');
  banner.innerHTML = '<p>Разрешить Google Analytics для статистики посещений? <a href="/' + slug + '/privacy.html">О данных</a></p>' +
    '<button class="pf-button" type="button" data-choice="allowed">Разрешить</button> ' +
    '<button class="pf-button" type="button" data-choice="denied">Отклонить</button>';
  banner.querySelectorAll('button').forEach(button => button.addEventListener('click', () => choice(button.dataset.choice)));
  document.body.append(banner);
})();
