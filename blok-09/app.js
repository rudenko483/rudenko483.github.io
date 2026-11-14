const booking = document.querySelector('#booking');
const confirmation = document.querySelector('#confirmation');
const photo = document.querySelector('#photo');
const form = document.querySelector('#booking-form');
const service = document.querySelector('#service');
const price = document.querySelector('#price');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let opener;

function openDialog(dialog, trigger) {
  opener = trigger;
  dialog.showModal();
}

function updatePrice() {
  price.textContent = service.selectedOptions[0].dataset.price;
}

document.querySelectorAll('[data-book]').forEach(button => {
  button.addEventListener('click', () => {
    form.reset();
    if (button.dataset.book) service.value = button.dataset.book;
    updatePrice();
    openDialog(booking, button);
    service.focus();
  });
});
service.addEventListener('change', updatePrice);

form.addEventListener('submit', event => {
  event.preventDefault();
  const selected = service.selectedOptions[0];
  const time = new FormData(form).get('time');
  document.querySelector('#confirmation-summary').textContent = [selected.textContent, time, selected.dataset.price].join(' · ');
  booking.close();
  confirmation.showModal();
  document.querySelector('#confirmation-title').focus();
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) opener?.focus();
  });
});

const filters = Array.from(document.querySelectorAll('[data-filter]'));
const photos = Array.from(document.querySelectorAll('[data-look]'));
const count = document.querySelector('#gallery-count');

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    if (filter.getAttribute('aria-pressed') === 'true') return;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    let visible = 0;
    photos.forEach(card => {
      card.hidden = filter.dataset.filter !== 'all' && card.dataset.look !== filter.dataset.filter;
      if (card.hidden) return;
      visible++;
      if (!reduceMotion.matches) card.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    });
    count.textContent = 'Показано фото: ' + visible;
  });
});

photos.forEach(card => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    const enlarged = document.querySelector('#photo-image');
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    document.querySelector('#photo-title').textContent = card.querySelector('span').textContent.trim();
    openDialog(photo, card);
  });
});
