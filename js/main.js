// Neologicon JS
console.log('Neologicon prêt');

document.addEventListener("DOMContentLoaded", () => {
  // Fonction utilitaire pour charger un fragment HTML
  function loadFragment(id, path, callback) {
    const container = document.getElementById(id);
    if (container) {
      fetch(path)
        .then(res => {
          // CORRECTION 1 : Suppression du <br> dans la chaîne
          if (!res.ok) throw new Error(`Impossible de charger ${path}`);
          return res.text();
        })
        .then(html => {
          container.innerHTML = html;
          if (callback) callback();
        })
        .catch(err => console.error(err));
    }
  }

  // Détection du niveau de profondeur (sert à calculer les chemins relatifs)
  const path = window.location.pathname;
  const inPages = path.includes("/pages/");
  const depth = (path.match(/\//g) || []).length;
  const base = depth >= 3 ? "../../" : inPages ? "../" : "";

  // Chemins vers les fragments
  const headerPath = base + "partials/header.html";
  const footerPath = base + "partials/footer.html";
  const animaginauxPath = base + "partials/animaginaux-nav.html";
  const glossairePath = base + "partials/glossaire-nav.html";

  // Table de routage (cas particuliers)
  const routes = {
    index: "index.html",
    eneide: "pages/eneide/eneide.html",
    glossaire: "pages/glossaire/glossaire.html",
    chorale: "pages/chorale/chorale.html",
    "chorale-info":"pages/chorale/info.html",
    "chorale-prochaineMesse":"pages/chorale/prochaineMesse.html",
    // CORRECTION 2 : psaumes (orthographe) et cohérence de la clé
    "chorale-psaumes": "pages/chorale/psaumes.html" 
  };

  // Fonction utilitaire pour mettre à jour les liens d'un conteneur
  function updateLinks(containerSelector) {
    // CORRECTION 3 : Suppression du <br> dans le sélecteur et le chemin
    document.querySelectorAll(`${containerSelector} a[data-link]`).forEach(a => {
      const target = a.getAttribute("data-link");
      if (routes[target]) {
        a.href = base + routes[target];
      } else {
        a.href = base + `pages/${target}.html`;
      }
    });
  }

  // --- Charger le header ---
  loadFragment("header", headerPath, () => {
    updateLinks("nav");

    // Ré-attacher le menu hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("show");
      });
    }
  });

  // --- Charger le footer ---
  loadFragment("footer", footerPath, () => {
    updateLinks("footer");
  });

  // --- Charger la bannière Animaginaux ---
  loadFragment("animaginaux-nav", animaginauxPath);

  // --- Charger les bannières Glossaire haut et bas ---
  loadFragment("glossaire-nav-top", glossairePath);
  loadFragment("glossaire-nav-bottom", glossairePath);

  // --- Logs debug ---
  if (path.endsWith("index.html") || path.endsWith("/")) {
    console.log("Bienvenue sur la page d'accueil !");
  } else if (path.includes("animaginaux")) {
    console.log("Page Animaginaux détectée");
  } else if (path.includes("glossaire")) {
    console.log("Page Glossaire détectée");
  } else if (path.includes("legendes")) {
    console.log("Page Légendes détectée");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Sélectionne tous les éléments ayant la classe dropdown
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.dropbtn');
    
    // Gestion du clic sur mobile (ou tactile)
    link.addEventListener('click', (e) => {
      // Vérifie si on est sur un écran mobile (moins de 769px)
      if (window.innerWidth <= 768) {
        e.preventDefault(); // Empêche la navigation immédiate
        
        // Basculer l'affichage du sous-menu
        const content = dropdown.querySelector('.dropdown-content');
        const isVisible = content.style.display === 'block';
        
        // Ferme les autres sous-menus ouverts (optionnel, pour la propreté)
        document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
        
        content.style.display = isVisible ? 'none' : 'block';
      }
    });
  });

  // Fermer les menus si on clique ailleurs sur la page
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
    }
  });
});