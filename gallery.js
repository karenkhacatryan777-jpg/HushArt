(() => {
  'use strict';
  const category = document.body.dataset.category;
  const raw = window.HUSHSTONE_GALLERIES?.[category] ?? [];
  const works = raw.filter(item => item && typeof item.src === 'string' && item.src.trim());
  const grid = document.getElementById('category-gallery');
  const empty = document.getElementById('gallery-empty');
  const filters = document.getElementById('gallery-filters');
  const dialog = document.getElementById('work-lightbox');
  const image = document.getElementById('lb-image');
  const title = document.getElementById('lb-title');
  const description = document.getElementById('lb-description');
  const selectedInput = document.getElementById('selected-work');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  let visible = works;
  let activeIndex = 0;
  let previousFocus = null;
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const selectedLabel = item => item.title?.trim() || item.src.split('/').pop();
  const choose = item => {
    selectedInput.value = selectedLabel(item);
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
    dialog.close();
    setTimeout(() => document.getElementById('customer-name').focus({preventScroll:true}), 250);
  };
  function updateLightbox() {
    const item = visible[activeIndex];
    if (!item) return;
    image.classList.remove('zoomed');
    document.getElementById('lb-zoom').setAttribute('aria-pressed','false');
    document.getElementById('lb-zoom').textContent = 'Մեծացնել +';
    image.src = item.src;
    image.alt = selectedLabel(item);
    title.textContent = item.title || '';
    title.hidden = !item.title;
    description.textContent = item.description || '';
    description.hidden = !item.description;
    const multi = visible.length > 1;
    dialog.querySelector('.lb-prev').hidden = !multi;
    dialog.querySelector('.lb-next').hidden = !multi;
  }
  function open(index) {
    activeIndex = index;
    previousFocus = document.activeElement;
    updateLightbox();
    dialog.showModal();
  }
  function move(step) {
    activeIndex = (activeIndex + step + visible.length) % visible.length;
    updateLightbox();
  }
  function render(type='Բոլորը') {
    visible = type === 'Բոլորը' ? works : works.filter(item => item.type === type);
    grid.replaceChildren();
    empty.hidden = visible.length > 0;
    visible.forEach((item, index) => {
      const card = create('button','work-card');
      card.type = 'button';
      card.setAttribute('aria-label', `Դիտել՝ ${selectedLabel(item)}`);
      const photo = create('img');
      photo.src = item.src;
      photo.alt = selectedLabel(item);
      photo.loading = 'lazy';
      photo.addEventListener('error', () => { card.remove(); if (!grid.children.length) empty.hidden = false; }, {once:true});
      const body = create('span','work-card-body');
      body.append(create('span','work-card-title',item.title || 'Դիտել աշխատանքը'));
      if (item.description) body.append(create('span','work-card-desc',item.description));
      card.append(photo,body);
      card.addEventListener('click',() => open(index));
      grid.append(card);
    });
  }
  const types = [...new Set(works.map(item => item.type).filter(Boolean))];
  if (types.length) {
    ['Բոլորը',...types].forEach(type => {
      const button = create('button',type === 'Բոլորը' ? 'active' : '',type);
      button.type = 'button';
      button.addEventListener('click',() => {
        filters.querySelectorAll('button').forEach(b => b.classList.toggle('active',b === button));
        render(type);
      });
      filters.append(button);
    });
  }
  render();
  dialog.querySelector('.lb-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.lb-prev').addEventListener('click',()=>move(-1));
  dialog.querySelector('.lb-next').addEventListener('click',()=>move(1));
  dialog.addEventListener('click',e => {if (e.target === dialog) dialog.close();});
  dialog.addEventListener('close',() => {image.classList.remove('zoomed');previousFocus?.focus?.({preventScroll:true});});
  document.getElementById('lb-zoom').addEventListener('click',e => {
    const zoom = image.classList.toggle('zoomed');
    e.currentTarget.setAttribute('aria-pressed',String(zoom));
    e.currentTarget.textContent = zoom ? 'Փոքրացնել −' : 'Մեծացնել +';
  });
  document.getElementById('lb-order').addEventListener('click',()=>choose(visible[activeIndex]));
  document.addEventListener('keydown',e => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft' && visible.length > 1) move(-1);
    if (e.key === 'ArrowRight' && visible.length > 1) move(1);
  });
  menuButton.addEventListener('click',()=>{
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('inquiry-form').addEventListener('submit',e => {
    e.preventDefault();
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const message = document.getElementById('customer-message').value.trim();
    const subject = `HushArt Armenian Top Store պատվերի հարցում — ${document.querySelector('.category-hero h1').textContent}`;
    const body = `Անուն՝ ${name}\nՀեռախոս՝ ${phone}\nԲաժին՝ ${category}\nԸնտրված աշխատանք՝ ${selectedInput.value || 'Չկա'}\nՀաղորդագրություն՝ ${message}`;
    window.location.href = `mailto:Hushart@mail.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
