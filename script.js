// ===== Theme (Dark/Light) with persistence =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.setAttribute('data-theme', savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== Sticky header shadow on scroll =====
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Load projects from content/projects.json =====
async function loadProjects() {
  const grid = document.getElementById('workGrid');
  const emptyState = document.getElementById('emptyState');
  try {
    const res = await fetch('content/projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('no data file yet');
    const data = await res.json();
    const projects = Array.isArray(data.projects) ? data.projects : [];

    if (!projects.length) return; // keep empty state visible

    emptyState.remove();
    projects.forEach((p, i) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        ${p.image ? `<div class="card-media"><img src="${p.image}" alt="${p.title || ''}" loading="lazy"></div>` : ''}
        <div class="card-body">
          <p class="card-index">${String(i + 1).padStart(2, '0')}</p>
          <h3 class="card-title">${p.title || ''}</h3>
          <p class="card-desc">${p.description || ''}</p>
        </div>`;
      grid.appendChild(card);
    });
  } catch (e) {
    // No projects file yet (first deploy) — empty state stays as-is.
  }
}
loadProjects();
