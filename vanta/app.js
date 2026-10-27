(() => {
  'use strict';
  const programs = {
    refresh: {name:'Refresh', title:'Освежить автомобиль', price:6000, duration:'Около 4 часов'},
    signature: {name:'Signature', title:'Вернуть глубину цвета', price:24000, duration:'Около 1–2 дней'},
    complete: {name:'Complete', title:'Обновить комплексно', price:42000, duration:'Около 2–3 дней'}
  };
  const form = document.getElementById('estimate-form');
  const body = document.getElementById('body');
  const program = document.getElementById('package');
  const glass = document.getElementById('glass');
  const status = document.getElementById('save-status');
  const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
  const setText = (id, text) => {document.getElementById(id).textContent = text;};
  function calculation() {
    const selected = programs[program.value];
    const bodyPrice = Math.round(selected.price * Number(body.value)) - selected.price;
    return {selected, bodyName:body.options[body.selectedIndex].text, bodyPrice, extra:glass.checked ? 3000 : 0, total:selected.price + bodyPrice + (glass.checked ? 3000 : 0)};
  }
  function update() {
    const c = calculation();
    setText('receipt-program', c.selected.title);
    setText('receipt-english', c.selected.name);
    setText('receipt-body', c.bodyName);
    setText('receipt-extra', glass.checked ? 'Состав для стёкол' : 'Без дополнений');
    setText('receipt-duration', c.selected.duration);
    setText('cost-base', money(c.selected.price));
    setText('cost-body', money(c.bodyPrice));
    setText('cost-glass', money(c.extra));
    setText('total', money(c.total));
    status.textContent = '';
  }
  form.addEventListener('change', update);
  document.querySelectorAll('[data-package]').forEach(button => button.addEventListener('click', () => {
    program.value = button.dataset.package;
    update();
    document.getElementById('estimate').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    program.focus({preventScroll:true});
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const c = calculation();
    const text = ['VANTA — демонстрационная смета','',`Программа: ${c.selected.name} — ${c.selected.title}`,`Автомобиль: ${c.bodyName}`,`Дополнения: ${glass.checked ? 'Гидрофобный состав для стёкол' : 'Без дополнений'}`,`Срок: ${c.selected.duration}`,'',`Базовая стоимость: ${money(c.selected.price)}`,`Поправка на размер: ${money(c.bodyPrice)}`,`Стёкла: ${money(c.extra)}`,`Итого, ориентировочно: ${money(c.total)}`,'','Цены и сроки демонстрационные. Это не запись и не оферта.','Данные не отправлены. Окончательный состав и стоимость определяют после осмотра.'].join('\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = `VANTA-${c.selected.name}-расчёт.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    status.textContent = 'Файл расчёта подготовлен к сохранению.';
  });
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activate(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) {event.preventDefault();activate(next);next.focus();}
    });
  });
  update();
})();
