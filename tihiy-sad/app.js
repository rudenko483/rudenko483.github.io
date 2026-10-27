const products = {
  morning: {name:'Розовое утро',description:'Садовые розы, гербера и гвоздики. Свободная форма в нежно-розовой гамме.',image:'morning-v2.webp',prices:[3900,5500,7200],sizes:['Небольшой','Средний','Большой']},
  whisper: {name:'Тихое признание',description:'Пыльно-розовые розы и лёгкая статица в молочной бумаге.',image:'whisper-v2.webp',prices:[4500,6200,8100],sizes:['Небольшой','Средний','Большой']},
  iris: {name:'Один прекрасный ирис',description:'Персиковый ирис на длинном стебле. На изображении — один цветок.',image:'iris-v2.webp',prices:[900,2100,3300],sizes:['Один цветок','Три стебля','Пять стеблей']}
};
const dialog=document.querySelector('#composition');
const size=document.querySelector('#size');
const vase=document.querySelector('#vase');
const card=document.querySelector('#card');
const cardDetails=document.querySelector('#card-details');
const status=document.querySelector('#save-status');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let current='morning';
let saved=null;
let trigger=null;
let toastTimer;
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const cost=()=>products[current].prices[Number(size.value)]+(vase.checked?1200:0);
function update(){document.querySelector('#flower-total').textContent=money(cost());status.textContent='';}
function open(id,button,restore=false){
  current=id;trigger=button;
  clearTimeout(toastTimer);document.querySelector('#toast').classList.remove('visible');document.querySelector('#toast').textContent='';
  const product=products[id];
  document.querySelector('#dialog-title').textContent=product.name;
  document.querySelector('#dialog-description').textContent=product.description;
  document.querySelector('#dialog-photo').src='assets/'+product.image;
  document.querySelector('#dialog-photo').alt=product.name+' — визуальная концепция';
  size.replaceChildren(...product.sizes.map((text,i)=>new Option(text,String(i))));
  size.value=restore?String(saved.size):'0';
  vase.checked=restore?saved.vase:false;
  card.value=restore?saved.card:'';
  cardDetails.open=Boolean(card.value);
  update();dialog.showModal();dialog.scrollTop=0;
}
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>open(button.dataset.product,button)));
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
size.addEventListener('change',update);vase.addEventListener('change',update);
card.addEventListener('input',()=>{status.textContent='';});
function remember(){saved={id:current,size:Number(size.value),vase:vase.checked,card:card.value};document.querySelector('#selection-count').textContent='1';}
document.querySelector('#composition-form').addEventListener('submit',event=>{event.preventDefault();remember();status.textContent='Выбор сохранён в этой вкладке. Заказ не оформлялся.';});
document.querySelector('#open-selection').addEventListener('click',event=>{
  if(saved){open(saved.id,event.currentTarget,true);return;}
  const toast=document.querySelector('#toast');toast.textContent='Пока пусто. Выберите одну из трёх композиций.';toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),5000);
  document.querySelector('#collection').scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth'});
});
document.querySelector('#download').addEventListener('click',()=>{
  remember();const p=products[current];
  const text=['ТИХИЙ САД — ДЕМОНСТРАЦИОННЫЙ ВЫБОР','Это не заказ. Вымышленная мастерская.','',`Композиция: ${p.name}`,`Размер: ${p.sizes[Number(size.value)]}`,`Ваза: ${vase.checked?'да':'нет'}`,`Открытка: ${card.value||'без текста'}`,`Демостоимость: ${money(cost())}`,'','Оплата и доставка не подключены. Данные никуда не отправлены.'].join('\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='tihiy-sad-moy-vybor.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='Файл подготовлен к скачиванию. Заказ не оформлялся.';
});
if('IntersectionObserver' in window&&!reducedMotion.matches){
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(element=>observer.observe(element));
  reducedMotion.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('js-motion');observer.disconnect();}},{once:true});
}
