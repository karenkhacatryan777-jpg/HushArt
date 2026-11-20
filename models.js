(() => {
  const models = Array.isArray(window.HUSHSTONE_3D_MODELS) ? window.HUSHSTONE_3D_MODELS : [];
  const grid = document.getElementById('models-grid');
  const filters = document.getElementById('model-filters');
  const dialog = document.getElementById('model-dialog');
  const empty = document.getElementById('models-empty');
  let visible = models.slice(), active = 0;
  const el = (tag, cls, text) => {const n=document.createElement(tag); if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  function mailto(m) {const subject=`HushArt Armenian Top Store — հարցում ${m.id}`; const body=`Բարև ձեզ, ցանկանում եմ տեղեկանալ հետևյալ նախագծի մասին։\nՄոդել՝ ${m.title}\nՀամար՝ ${m.id}\n\nԻմ անունը՝\nՀեռախոս՝`;return `mailto:Hushart@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;}
  function open(i){active=i;const m=visible[active];if(!m)return;document.getElementById('model-image').src=m.image;document.getElementById('model-image').alt=m.title;document.getElementById('model-id').textContent=m.id;document.getElementById('model-title').textContent=m.title;document.getElementById('model-description').textContent=m.description||'';document.getElementById('model-order').href=mailto(m);if(!dialog.open)dialog.showModal();}
  function move(n){if(visible.length)open((active+n+visible.length)%visible.length);}
  function render(type='Բոլորը'){
    visible=models.filter(m=>type==='Բոլորը'||m.type===type);grid.replaceChildren();empty.hidden=visible.length>0;
    visible.forEach((m,i)=>{const card=el('article','model-card');const trigger=el('button','model-image-button');trigger.type='button';trigger.setAttribute('aria-label',`${m.title} — դիտել`);const img=el('img');img.src=m.image;img.alt=m.title;img.loading='lazy';img.onerror=()=>{img.style.display='none';trigger.append(el('span','demo-label','Նկարը դեռ ավելացված չէ'));};trigger.append(img);if(m.image.includes('/demo-'))trigger.append(el('span','demo-label','Ցուցադրական պատկեր'));trigger.addEventListener('click',()=>open(i));const content=el('div','model-card-content');content.append(el('span','code',m.id),el('h3','',m.title),el('p','',m.description||''));const btn=el('button','', 'Դիտել մոդելը →');btn.type='button';btn.addEventListener('click',()=>open(i));content.append(btn);card.append(trigger,content);grid.append(card);});
  }
  const types=['Բոլորը',...new Set(models.map(m=>m.type).filter(Boolean))];
  types.forEach((type,i)=>{const b=el('button',i===0?'active':'',type);b.type='button';b.addEventListener('click',()=>{filters.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(type);});filters.append(b);});
  document.getElementById('model-close').addEventListener('click',()=>dialog.close());document.getElementById('model-prev').addEventListener('click',()=>move(-1));document.getElementById('model-next').addEventListener('click',()=>move(1));dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});document.addEventListener('keydown',e=>{if(!dialog.open)return;if(e.key==='ArrowRight')move(1);if(e.key==='ArrowLeft')move(-1);});render();
})();