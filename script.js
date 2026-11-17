/* Ruang Literasi — artikel diambil dari content/posts.json yang dibangun dari CMS. */
const SITE = {email: 'halo@example.com'}; // Ganti dengan email Anda
let posts = [];
let categories = ['Semua'];
let activeCategory = 'Semua';
let searchQuery = '';
const byId = id => document.getElementById(id);
const escapeHtml = text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function drawCategories() {
  byId('categories').innerHTML = categories.map(c => `<button type="button" class="category-button ${c === activeCategory ? 'active' : ''}" data-category="${escapeHtml(c)}" aria-pressed="${c === activeCategory}">${escapeHtml(c)}</button>`).join('');
  byId('categories').querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    activeCategory = b.dataset.category;
    drawCategories(); drawPosts();
  }));
}
function drawPosts() {
  const filtered = posts.filter(p => (activeCategory === 'Semua' || p.category === activeCategory) &&
    `${p.title} ${p.category} ${p.excerpt}`.toLocaleLowerCase('id').includes(searchQuery));
  byId('article-grid').innerHTML = filtered.map(p => `<article class="article-card">
    <a class="article-image" href="#baca/${encodeURIComponent(p.slug)}" aria-label="Baca ${escapeHtml(p.title)}"><img src="${escapeHtml(p.image)}" alt="Ilustrasi artikel ${escapeHtml(p.title)}" loading="lazy"/><span class="card-category">${escapeHtml(p.category)}</span></a>
    <div class="card-meta"><time>${escapeHtml(p.date)}</time><span class="meta-dot"></span><span>${p.minutes} menit baca</span></div>
    <h3 class="card-title"><a href="#baca/${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a></h3>
    <p class="card-excerpt">${escapeHtml(p.excerpt)}</p><a class="read-link" href="#baca/${encodeURIComponent(p.slug)}">Baca artikel <span>↗</span></a>
  </article>`).join('');
  byId('empty-state').hidden = filtered.length > 0;
  byId('article-count').textContent = `Menampilkan ${filtered.length} dari ${posts.length} artikel`;
}

function showArticle(slug) {
  const p = posts.find(post => post.slug === slug);
  if (!p) { history.replaceState(null, '', '#artikel'); return; }
  byId('dialog-content').innerHTML = `<div class="dialog-kicker">${escapeHtml(p.category).toUpperCase()} / ${p.minutes} MENIT BACA</div>
    <h2 class="dialog-title" id="dialog-title">${escapeHtml(p.title)}</h2><p class="dialog-date">${escapeHtml(p.date)}</p>
    <img class="dialog-cover" src="${escapeHtml(p.image)}" alt="Ilustrasi ${escapeHtml(p.title)}" />
    <div class="article-body">${p.paragraphs.map(t => `<p>${escapeHtml(t)}</p>`).join('')}</div>
    <p class="dialog-end">✳ Terima kasih sudah belajar bersama Ruang Literasi.</p>`;
  const dialog = byId('article-dialog');
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  document.title = `${p.title} — Ruang Literasi`;
}
function closeArticle() {
  const dialog = byId('article-dialog');
  if (dialog.open) dialog.close();
  document.title = 'Ruang Literasi — Blog Pendidikan';
}
function handleRoute() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (hash.startsWith('baca/')) showArticle(hash.slice(5));
  else closeArticle();
  document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === (hash || 'beranda')));
  byId('main-nav').classList.remove('open');
  byId('mobile-toggle').setAttribute('aria-expanded', 'false');
}

byId('search-input').addEventListener('input', e => {searchQuery = e.target.value.toLocaleLowerCase('id').trim(); drawPosts();});
byId('reset-search').addEventListener('click', () => {activeCategory = 'Semua';searchQuery = '';byId('search-input').value = '';drawCategories();drawPosts();});
byId('mobile-toggle').addEventListener('click', e => {const open = byId('main-nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', String(open));});
byId('close-article').addEventListener('click', () => {location.hash = 'artikel';closeArticle();});
byId('article-dialog').addEventListener('click', e => {if (e.target === byId('article-dialog')) {location.hash = 'artikel';closeArticle();}});
byId('article-dialog').addEventListener('close', () => {if (location.hash.startsWith('#baca/')) location.hash = 'artikel';});
window.addEventListener('hashchange', handleRoute);
window.addEventListener('scroll', () => {const doc = document.documentElement;const pct = doc.scrollHeight > innerHeight ? scrollY/(doc.scrollHeight-innerHeight)*100 : 0;byId('reading-progress').style.width = `${Math.min(100,pct)}%`;}, {passive:true});
const savedTheme = localStorage.getItem('ruang-literasi-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
byId('theme-toggle').addEventListener('click', () => {const dark = document.body.classList.toggle('dark');localStorage.setItem('ruang-literasi-theme', dark ? 'dark' : 'light');});
['nav-contact','about-email','newsletter-email'].forEach(id => {const el = byId(id); el.href = `mailto:${encodeURIComponent(SITE.email)}?subject=${encodeURIComponent('Halo Ruang Literasi')}`;});
byId('year').textContent = new Date().getFullYear();
async function loadPosts() {
  try {
    const response = await fetch('content/posts.json', {cache: 'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Format artikel tidak sesuai');
    posts = data;
    categories = ['Semua', ...new Set(posts.map(p => p.category))];
    drawCategories(); drawPosts(); handleRoute();
  } catch (error) {
    console.error('Artikel tidak berhasil dimuat:',error);
    byId('article-grid').innerHTML = '<p class="load-error">Artikel belum dapat dimuat. Periksa koneksi atau coba muat ulang halaman.</p>';
    byId('article-count').textContent = 'Artikel tidak tersedia';
    handleRoute();
  }
}
loadPosts();
