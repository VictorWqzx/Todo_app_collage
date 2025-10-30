(function () {
  'use strict';

  // Slider
  const track = document.getElementById('sliderTrack');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const dotsWrap = document.getElementById('sliderDots');
  let index = 0;
  let slidesCount = 0;
  let autoTimer = null;

  function initSlider() {
    if (!track) return;
    slidesCount = track.children.length;
    renderDots();
    updateSlider();
    btnPrev && btnPrev.addEventListener('click', () => goto(index - 1));
    btnNext && btnNext.addEventListener('click', () => goto(index + 1));
    startAutoplay();
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });
  }

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < slidesCount; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
      b.addEventListener('click', () => goto(i));
      dotsWrap.appendChild(b);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
  }

  function goto(i) {
    if (!track) return;
    index = (i + slidesCount) % slidesCount;
    updateSlider();
    restartAutoplay();
  }

  function updateSlider() {
    const x = `translateX(-${index * 100}%)`;
    track.style.transform = x;
    updateDots();
  }

  function startAutoplay() {
    stopAutoplay();
    autoTimer = setInterval(() => goto(index + 1), 4000);
  }
  function stopAutoplay() {
    if (autoTimer) clearInterval(autoTimer);
  }
  function restartAutoplay() { startAutoplay(); }

  // Todo App
  const form = document.getElementById('todoForm');
  const input = document.getElementById('todoInput');
  const list = document.getElementById('todoList');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const clearAllBtn = document.getElementById('clearAll');

  const STORAGE_KEY = 'todo-app-items';
  /** @type {{id:string,title:string,done:boolean}[]} */
  let items = [];

  function loadItems() {
    try { items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') || []; }
    catch { items = []; }
  }
  function saveItems() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function renderList() {
    if (!list) return;
    list.innerHTML = '';
    for (const it of items) {
      const li = document.createElement('li');
      li.className = 'todo-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = it.done;
      checkbox.addEventListener('change', () => toggleDone(it.id, checkbox.checked));

      const title = document.createElement('div');
      title.className = 'todo-item__title' + (it.done ? ' todo-item__title--done' : '');
      title.textContent = it.title;

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '8px';

      const editBtn = document.createElement('button');
      editBtn.className = 'todo-item__btn';
      editBtn.textContent = 'Ред.';
      editBtn.addEventListener('click', () => editItem(it.id));

      const okBtn = document.createElement('button');
      okBtn.className = 'todo-item__btn todo-item__btn--ok';
      okBtn.textContent = it.done ? 'Снять' : 'Готово';
      okBtn.addEventListener('click', () => toggleDone(it.id, !it.done));

      const delBtn = document.createElement('button');
      delBtn.className = 'todo-item__btn todo-item__btn--danger';
      delBtn.textContent = 'Удалить';
      delBtn.addEventListener('click', () => removeItem(it.id));

      actions.append(editBtn, okBtn, delBtn);
      li.append(checkbox, title, actions);
      list.appendChild(li);
    }
  }

  function addItem(title) {
    const trimmed = title.trim();
    if (!trimmed) return;
    items.unshift({ id: String(Date.now()) + Math.random().toString(16).slice(2), title: trimmed, done: false });
    saveItems();
    renderList();
  }

  function toggleDone(id, done) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    it.done = done;
    saveItems();
    renderList();
  }

  function editItem(id) {
    const it = items.find(x => x.id === id);
    if (!it) return;
    const next = prompt('Изменить задачу:', it.title);
    if (next == null) return;
    const v = next.trim();
    if (!v) return;
    it.title = v;
    saveItems();
    renderList();
  }

  function removeItem(id) {
    items = items.filter(x => x.id !== id);
    saveItems();
    renderList();
  }

  function clearCompleted() {
    items = items.filter(x => !x.done);
    saveItems();
    renderList();
  }
  function clearAll() {
    if (!confirm('Удалить все задачи?')) return;
    items = [];
    saveItems();
    renderList();
  }

  function initTodo() {
    if (!form || !input || !list) return;
    loadItems();
    renderList();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addItem(input.value);
      input.value = '';
      input.focus();
    });
    clearCompletedBtn && clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn && clearAllBtn.addEventListener('click', clearAll);
  }

  // Mobile nav toggle (simple)
  function initBurger() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    if (!burger || !nav) return;
    burger.addEventListener('click', () => {
      const opened = nav.style.display === 'flex';
      nav.style.display = opened ? 'none' : 'flex';
      burger.setAttribute('aria-expanded', String(!opened));
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initTodo();
    initBurger();
  });
})();


