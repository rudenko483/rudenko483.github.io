document.documentElement.classList.add('js');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}},{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const menu=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню')}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const booking=document.querySelector('#booking');const select=document.querySelector('#service-select');
function estimate(){const o=select.selectedOptions[0];document.querySelector('#estimate-time').textContent=o.dataset.duration;document.querySelector('#estimate-price').textContent=o.dataset.price}
select.addEventListener('change',estimate);
let lastFocus;
function openDialog(dialog){lastFocus=document.activeElement;dialog.showModal();document.body.classList.add('modal-open')}
document.querySelectorAll('[data-book]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.service)select.value=btn.dataset.service;estimate();closeMenu();openDialog(booking)}));
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastFocus?.focus()})});
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=btn.dataset.filter!=='all'&&card.dataset.category!==btn.dataset.filter;if(!card.hidden){count++;card.classList.add('visible');if(!reduceMotion.matches)card.animate([{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'ease-out'})}});document.querySelector('.gallery-live').textContent=`Показано образов: ${count}`}));
const lightbox=document.querySelector('#lightbox');let current=0;
function galleryItems(){return [...document.querySelectorAll('[data-gallery]')].filter(el=>!el.hidden)}
function renderGallery(){const items=galleryItems();current=(current+items.length)%items.length;const card=items[current];lightbox.querySelector('img').src=card.dataset.gallery;lightbox.querySelector('img').alt=card.querySelector('img').alt;lightbox.querySelector('p').textContent=card.dataset.title+' · '+(current+1)+' / '+items.length}
document.querySelectorAll('[data-gallery]').forEach(card=>card.addEventListener('click',()=>{current=galleryItems().indexOf(card);renderGallery();openDialog(lightbox)}));
document.querySelector('[data-gallery-prev]').addEventListener('click',()=>{current--;renderGallery()});document.querySelector('[data-gallery-next]').addEventListener('click',()=>{current++;renderGallery()});
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){current++;renderGallery()}if(e.key==='ArrowLeft'){current--;renderGallery()}});
let ticking=false;
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.transform=`scaleX(${max?scrollY/max:0})`;if(!reduceMotion.matches&&innerWidth>760){const pic=document.querySelector('.hero-photo');if(pic&&scrollY<innerHeight)pic.style.translate=`0 ${Math.min(scrollY*.04,22)}px`}ticking=false}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true}},{passive:true});updateScroll();
document.addEventListener('visibilitychange',()=>{document.querySelectorAll('.ticker>div,.hero-stamp svg').forEach(el=>el.style.animationPlayState=document.hidden?'paused':'running')});

const moving=new IntersectionObserver(es=>es.forEach(e=>{e.target.style.animationPlayState=e.isIntersecting&&!document.hidden?"running":"paused"}));document.querySelectorAll(".ticker>div,.hero-stamp svg,.interlude-star").forEach(el=>moving.observe(el));
