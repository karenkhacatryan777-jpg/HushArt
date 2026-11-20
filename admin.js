(()=>{
const $=s=>document.querySelector(s), esc=HS.escape;
let works=[];
const login=$('#login'),dash=$('#dashboard');
async function load(){try{await HS.api('/api/admin/me');login.hidden=true;dash.hidden=false;await refresh()}catch{login.hidden=false;dash.hidden=true}}
async function refresh(){
  works=(await HS.api('/api/admin/works')).works;
  const orders=(await HS.api('/api/admin/orders')).orders;
  $('#works-list').innerHTML=works.length?works.map(w=>`<p>${esc(w.title)} (${esc(w.code||'')}) <button type="button" data-edit="${esc(w.id)}">Խմբագրել</button> <button type="button" data-delete="${esc(w.id)}">Ջնջել</button></p>`).join(''):'Դեռ աշխատանքներ չկան';
  $('#orders-list').innerHTML=orders.length?`<table><thead><tr><th>Համար</th><th>Անուն</th><th>Հեռախոս</th><th>Աշխատանք</th><th>Կարգավիճակ</th></tr></thead><tbody>${orders.map(o=>`<tr><td>${esc(o.id)}</td><td>${esc(o.name)}</td><td>${esc(o.phone)}</td><td>${esc(o.workCode||'')}<p>${esc(o.description||'')}</p>${o.attachment?`<a href="/api/admin/attachment/${encodeURIComponent(o.id)}">Կցված ֆայլ</a>`:''}</td><td><select data-status="${esc(o.id)}">${['new','contacted','completed'].map(st=>`<option ${o.status===st?'selected':''} value="${st}">${st}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table>`:'Դեռ պատվերներ չկան';
  $('#works-list').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{const w=works.find(x=>x.id===b.dataset.edit),f=$('#work-form');for(const k of ['id','title','code','category','material','dimensions','description'])f.elements[k].value=w[k]||'';f.elements.images.value=(w.images||[]).join('\n');f.elements.featured.checked=!!w.featured;f.scrollIntoView({behavior:'smooth'})});
  $('#works-list').querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Ջնջե՞լ աշխատանքը'))return;try{await HS.api('/api/admin/works/'+b.dataset.delete,{method:'DELETE'});await refresh()}catch(e){alert(e.message)}});
  $('#orders-list').querySelectorAll('[data-status]').forEach(s=>s.onchange=async()=>{try{await HS.api('/api/admin/orders/'+s.dataset.status,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:s.value})})}catch(e){alert(e.message)}});
  const settings=await HS.api('/api/admin/settings');$('#pricing-config').value=JSON.stringify(settings.settings.prices||{},null,2);
}
$('#login-form').onsubmit=async e=>{e.preventDefault();try{await HS.api('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:e.target.password.value})});await load()}catch(err){$('#login-status').textContent=err.message}};
$('#logout').onclick=async()=>{await HS.api('/api/admin/logout',{method:'POST'});await load()};
$('#pricing-form').onsubmit=async e=>{e.preventDefault();try{const prices=JSON.parse($('#pricing-config').value);await HS.api('/api/admin/settings',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({prices})});$('#pricing-status').textContent='Կարգավորումները պահպանվել են'}catch(err){$('#pricing-status').textContent=err.message}};
$('#work-form').onsubmit=async e=>{e.preventDefault();const f=e.target,out=$('#work-status');out.textContent='Պահպանվում է…';try{const data=Object.fromEntries(new FormData(f));data.featured=f.elements.featured.checked;data.images=f.elements.images.value.split('\n').map(s=>s.trim()).filter(Boolean);const files=[...$('#work-files').files];if(files.length>5)throw Error('Առավելագույնը 5 լուսանկար');data.uploads=await Promise.all(files.map(async file=>{if(file.size>5*1024*1024)throw Error('Լուսանկարը մեծ է');if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Սխալ նկարի տեսակ');return {mime:file.type,base64:await new Promise((res,rej)=>{const reader=new FileReader;reader.onload=()=>res(reader.result.split(',')[1]);reader.onerror=rej;reader.readAsDataURL(file)})}}));await HS.api('/api/admin/works'+(data.id?'/'+data.id:''),{method:data.id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});f.reset();out.textContent='Պահպանված է';await refresh()}catch(err){out.textContent=err.message}};
load();
})();
