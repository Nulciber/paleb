// Neologicon JS - Structure Souple
console.log('Neologicon prêt');

document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. CALCUL DYNAMIQUE DE LA PROFONDEUR (Structure Souple) ---
  const path = window.location.pathname;
  
  // On isole le répertoire courant (sans le nom du fichier)
  const dirPath = path.substring(0, path.lastIndexOf('/'));
  
  // On découpe le chemin en segments et on filtre les vides
  const segments = dirPath.split('/').filter(segment => segment.length > 0);
  
  // On construit la chaîne de remontée : chaque segment = un "../"
  // Si on est à la racine (segments.length === 0), base sera ""
  let base = "";
  if (segments.length > 0) {
    base = segments.map(() => "../").join("");
  }

  // Fonction utilitaire pour charger un fragment HTML
  function loadFragment(id, path, callback) {
    const container = document.getElementById(id);
    if (container) {
      fetch(path)
        .then(res => {
          if (!res.ok) {
            console.error(`Erreur chargement ${path}: ${res.status}`);
            throw new Error(`Impossible de charger ${path}`);
          }
          return res.text();
        })
        .then(html => {
          container.innerHTML = html;
          if (callback) callback();
        })
        .catch(err => console.error(err));
    }
  }

  // --- 2. DÉFINITION DES CHEMINS VERS LES FRAGMENTS ---
  // Ces chemins s'adaptent automatiquement grâce à la variable 'base'
  const headerPath = base + "partials/header.html";
  const footerPath = base + "partials/footer.html";
  const animaginauxPath = base + "partials/animaginaux-nav.html";
  const glossairePath = base + "partials/glossaire-nav.html";

  // --- 3. TABLE DE ROUTAGE ---
  // Les clés sont les valeurs de data-link, les valeurs sont les chemins relatifs
  const routes = {
    index: "index.html",
    eneide: "pages/eneide/eneide.html",
    glossaire: "pages/glossaire/glossaire.html",
    chorale: "pages/chorale/chorale.html",
    "chorale-info": "pages/chorale/info.html",
    "chorale-prochaineMesse": "pages/chorale/prochaineMesse.html",
    "chorale-psaumes": "pages/chorale/psaumes.html"
  };

  // Fonction utilitaire pour mettre à jour les liens d'un conteneur
  function updateLinks(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.querySelectorAll("a[data-link]").forEach(a => {
      const target = a.getAttribute("data-link");
      if (routes[target]) {
        a.href = base + routes[target];
      } else {
        // Fallback générique si la route n'est pas définie explicitement
        a.href = base + `pages/${target}.html`;
      }
    });
  }

  // --- 4. CHARGEMENT DES FRAGMENTS ---

  // Charger le header
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

  // Charger le footer
  loadFragment("footer", footerPath, () => {
    updateLinks("footer");
  });

  // Charger la bannière Animaginaux
  loadFragment("animaginaux-nav", animaginauxPath);

  // Charger les bannières Glossaire (haut et bas)
  // Note: Vérifiez que vos IDs HTML correspondent bien (glossaire-nav-top / bottom)
  loadFragment("glossaire-nav-top", glossairePath);
  loadFragment("glossaire-nav-bottom", glossairePath);

  // --- 5. LOGS DEBUG (Optionnel) ---
  if (path.endsWith("index.html") || path === "/" || path === "") {
    console.log("Bienvenue sur la page d'accueil !");
  } else if (path.includes("animaginaux")) {
    console.log("Page Animaginaux détectée");
  } else if (path.includes("glossaire")) {
    console.log("Page Glossaire détectée");
  } else if (path.includes("legendes")) {
    console.log("Page Légendes détectée");
  }
});

// --- 6. GESTION DES MENUS DÉROULANTS (Mobile) ---
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('.dropbtn');
    
    if (link) {
      link.addEventListener('click', (e) => {
        // Vérifie si on est sur un écran mobile (moins de 769px)
        if (window.innerWidth <= 768) {
          e.preventDefault(); // Empêche la navigation immédiate
          
          const content = dropdown.querySelector('.dropdown-content');
          if (!content) return;

          const isVisible = content.style.display === 'block';
          
          // Ferme les autres sous-menus ouverts
          document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
          
          content.style.display = isVisible ? 'none' : 'block';
        }
      });
    }
  });

  // Fermer les menus si on clique ailleurs sur la page
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-content').forEach(el => el.style.display = 'none');
    }
  });
});