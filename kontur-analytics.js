// Fill this value with the owner's GA4 measurement ID when analytics is ready.
const measurementId = '';
const analyticsKey = 'kontur-analytics-consent';

if (/^G-[A-Z0-9]+$/.test(measurementId)) {
  let consent;
  try {
    consent = localStorage.getItem(analyticsKey);
  } catch {
    // The page still works when browser storage is unavailable.
  }

  function startAnalytics() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(tag);
  }

  function chooseAnalytics(value) {
    try {
      localStorage.setItem(analyticsKey, value);
      location.reload();
    } catch {
      document.querySelector('.kontur-analytics-choice')?.remove();
      if (value === 'allowed') startAnalytics();
      else if (consent === 'allowed') location.reload();
    }
  }

  if (consent === 'allowed') startAnalytics();

  const settings = document.querySelector('[data-portfolio-analytics-toggle]');
  if (settings) {
    settings.hidden = false;
    settings.textContent = consent === 'allowed' ? 'Отключить аналитику' : 'Разрешить аналитику';
    settings.addEventListener('click', () => chooseAnalytics(consent === 'allowed' ? 'denied' : 'allowed'));
    document.querySelector('[data-portfolio-analytics-status]').textContent =
      consent === 'allowed' ? 'Вы разрешили Google Analytics.' : 'Google Analytics загружается только после вашего согласия.';
  }

  if (consent !== 'allowed' && consent !== 'denied') {
    const choices = document.createElement('aside');
    choices.className = 'kontur-analytics-choice';
    choices.setAttribute('aria-label', 'Настройки аналитики');
    choices.innerHTML = '<p>Разрешить Google Analytics для статистики посещений? <a href="/privacy/">О данных</a></p>' +
      '<button class="pill pill-primary" type="button" data-value="allowed">Разрешить</button>' +
      '<button class="pill pill-outline" type="button" data-value="denied">Отклонить</button>';
    for (const choice of choices.querySelectorAll('button')) {
      choice.addEventListener('click', () => chooseAnalytics(choice.dataset.value));
    }
    document.body.append(choices);
  }
}
