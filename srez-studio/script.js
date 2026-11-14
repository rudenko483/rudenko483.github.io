const b=document.querySelector('#menu'),n=document.querySelector('#nav');b.addEventListener('click',()=>{const o=n.classList.toggle('open');b.setAttribute('aria-expanded',String(o));b.textContent=o?'✕':'☰'});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='☰'}));if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}));document.querySelectorAll('.reveal').forEach(e=>io.observe(e))}else document.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'));const bookingForm = document.querySelector('#form');
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  window.showPortfolioReceipt({
    heading: 'Спасибо за заявку!',
    summary: bookingForm.querySelector('select').value,
    note: 'Демоформа проверена. Контакты не отправлены.',
    action: 'Вернуться к форме',
    trigger: event.submitter,
  });
});
