const prices={refresh:6000,signature:24000,complete:42000};
const labels={refresh:'Refresh',signature:'Signature',complete:'Complete'};
const form=document.querySelector('#estimate-form');
const body=document.querySelector('#body');
const program=document.querySelector('#package');
const glass=document.querySelector('#glass');
const money=value=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
const total=()=>Math.round(prices[program.value]*Number(body.value))+(glass.checked?3000:0);
function update(){document.querySelector('#total').textContent=money(total());document.querySelector('#estimate-status').textContent='';}
form.addEventListener('change',update);
document.querySelectorAll('[data-package]').forEach(button=>button.addEventListener('click',()=>{program.value=button.dataset.package;update();document.querySelector('#estimate').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});program.focus({preventScroll:true});}));
form.addEventListener('submit',event=>{event.preventDefault();const text=['VANTA — ДЕМОНСТРАЦИОННЫЙ РАСЧЁТ','Вымышленная студия. Не является записью или офертой.','',`Автомобиль: ${body.options[body.selectedIndex].text}`,`Программа: ${labels[program.value]}`,`Гидрофобный состав на стёкла: ${glass.checked?'да':'нет'}`,`Стоимость: ${money(total())}`,'','Данные никуда не отправлены. Реальные работы и цену согласовывают после осмотра.'].join('\n');const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='VANTA-demo-raschet.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#estimate-status').textContent='Деморасчёт подготовлен к скачиванию. Запись не создавалась.';});
update();
