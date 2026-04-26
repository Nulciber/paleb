// paleb JS
console.log('paleb prêt');

document.addEventListener("DOMContentLoaded", () => {

  // --- 1. CALCUL DYNAMIQUE DE LA PROFONDEUR ---
  const path = window.location.pathname;
  const dirPath = path.substring(0, path.lastIndexOf('/'));
  const segments = dirPath.split('/').filter(segment => segment.length > 0);

  let base = "";
  if (segments.length > 0) {
    base = segments.map(() => "../").join("");
  }

  // --- 2. CHARGEMENT DES FRAGMENTS HTML ---
  function loadFragment(id, fragPath, callback) {
    const container = document.getElementById(id);
    if (container) {
      fetch(fragPath)
        .then(res => {
          if (!res.ok) throw new Error(`Impossible de charger ${fragPath}`);
          return res.text();
        })
        .then(html => {
          container.innerHTML = html;
          if (callback) callback();
        })
        .catch(err => console.error(err));
    }
  }

  // --- 3. TABLE DE ROUTAGE ---
  const routes = {
    index:                   "index.html",
    eneide:                  "pages/eneide/eneide.html",
    glossaire:               "pages/glossaire/glossaire.html",
    chorale:                 "pages/chorale/chorale.html",
    "chorale/chorale":       "pages/chorale/chorale.html",
    "chorale/info":          "pages/chorale/info.html",
    "chorale/prochaineMesse":"pages/chorale/prochaineMesse.html",
    "chorale/psaumes":       "pages/chorale/psaumes.html",
    contact:                 "pages/contact.html",
    legendes:                "pages/legendes/legendes.html",
    animaginaux:             "pages/animaginaux/animaginaux.html",
  };

  function updateLinks(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    container.querySelectorAll("a[data-link]").forEach(a => {
      const target = a.getAttribute("data-link");
      if (routes[target]) {
        a.href = base + routes[target];
      } else {
        a.href = base + `pages/${target}.html`;
      }
    });
  }

  // --- 4. CHARGEMENT DU HEADER ---
  loadFragment("header", base + "partials/header.html", () => {
    updateLinks("nav");

    // Mettre à jour le logo dynamiquement
    const logoImg = document.getElementById('logo-img');
    if (logoImg) logoImg.src = base + 'assets/img/logo.png';

    // Menu hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }

    // Fermer le menu hamburger en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (navLinks && !e.target.closest('.navbar')) {
        navLinks.classList.remove('show');
      }
    });

    // --- 5. MENUS DÉROULANTS (Mobile) ---
    // Attaché ici car le header vient d'être injecté
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const link = dropdown.querySelector('.dropbtn');
      if (link) {
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const content = dropdown.querySelector('.dropdown-content');
            if (!content) return;
            const isVisible = content.style.display === 'block';
            document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
            content.style.display = isVisible ? 'none' : 'block';
          }
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
      }
    });
  });

  // --- FOOTER ---
  loadFragment("footer", base + "partials/footer.html", () => {
    updateLinks("footer");
  });

  // --- NAVIGATIONS SECONDAIRES ---
  loadFragment("animaginaux-nav", base + "partials/animaginaux-nav.html");
  loadFragment("glossaire-nav-top", base + "partials/glossaire-nav.html");
  loadFragment("glossaire-nav-bottom", base + "partials/glossaire-nav.html");
});
