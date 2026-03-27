const body = document.body;
const html = document.documentElement;
const langButtons = document.querySelectorAll("[data-lang-btn]");
const revealElements = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".stat-value[data-target]");
const magneticElements = document.querySelectorAll(".magnetic");
const rippleTargets = document.querySelectorAll(".ripple-target");
const navLinks = document.querySelectorAll("[data-nav-link]");
const scrollProgressBar = document.getElementById("scroll-progress-bar");
const presentationToggle = document.getElementById("presentation-toggle");

const workflowButtons = document.querySelectorAll("[data-workflow-step]");
const workflowTitleFr = document.getElementById("workflow-title-fr");
const workflowTitleEn = document.getElementById("workflow-title-en");
const workflowTextFr = document.getElementById("workflow-text-fr");
const workflowTextEn = document.getElementById("workflow-text-en");
const workflowKpisFr = document.getElementById("workflow-kpis-fr");
const workflowKpisEn = document.getElementById("workflow-kpis-en");

const workflowData = {
  signalement: {
    frTitle: "Etape 1 - Centraliser les signalements",
    enTitle: "Step 1 - Centralize incoming reports",
    frText:
      "Tous les signalements sont saisis depuis un point unique (guichet, agent, mobile). Chaque demande est horodatee, geolocalisee, et rattachee a un type de service.",
    enText:
      "All reports are captured in one entry point (desk, agent, mobile). Every request is timestamped, geolocated, and linked to a service category.",
    frKpis: ["Volume par type", "Delai de prise en charge", "Zones recurrentes"],
    enKpis: ["Volume by type", "Time to first handling", "Recurring zones"],
  },
  affectation: {
    frTitle: "Etape 2 - Affecter avec regles claires",
    enTitle: "Step 2 - Assign with clear rules",
    frText:
      "Le systeme assigne automatiquement ou manuellement selon la charge, la zone et la competence. Les responsables ont une vision temps reel de la repartition.",
    enText:
      "The system assigns tasks automatically or manually based on workload, area, and competency. Supervisors get a real-time view of allocation.",
    frKpis: ["Charge par equipe", "Equilibre des affectations", "Demandes en attente"],
    enKpis: ["Workload per team", "Assignment balance", "Pending requests"],
  },
  suivi: {
    frTitle: "Etape 3 - Suivre l'execution en continu",
    enTitle: "Step 3 - Track execution continuously",
    frText:
      "Chaque intervention est tracee: statut, commentaires, preuves photo, actions realisees. Les parties prenantes visualisent l'avancement sans rupture d'information.",
    enText:
      "Each intervention is tracked: status, comments, photo evidence, completed actions. Stakeholders can monitor progress without information gaps.",
    frKpis: ["Taux d'avancement", "Interventions bloquees", "Temps moyen de traitement"],
    enKpis: ["Progress rate", "Blocked interventions", "Average processing time"],
  },
  cloture: {
    frTitle: "Etape 4 - Cloturer et certifier la resolution",
    enTitle: "Step 4 - Close and certify resolution",
    frText:
      "La cloture valide les resultats: action terminee, verification, niveau de satisfaction, et archivage des preuves. La qualite de service devient mesurable.",
    enText:
      "Closure validates outcomes: completed action, verification, satisfaction level, and evidence archive. Service quality becomes measurable.",
    frKpis: ["Taux de resolution", "Satisfaction usager", "Retours post-cloture"],
    enKpis: ["Resolution rate", "Citizen satisfaction", "Post-closure returns"],
  },
  reporting: {
    frTitle: "Etape 5 - Reporter pour mieux decider",
    enTitle: "Step 5 - Report to improve decisions",
    frText:
      "Les donnees consolidees alimentent des tableaux de bord decideurs: performance des services, delais, priorites territoriales, plans d'amelioration.",
    enText:
      "Consolidated data powers decision dashboards: service performance, delays, territorial priorities, and improvement plans.",
    frKpis: ["Respect des SLA", "Evolution mensuelle", "Priorites budgetaires"],
    enKpis: ["SLA compliance", "Monthly trend", "Budget priorities"],
  },
};

let currentLanguage = "fr";
let currentWorkflowStep = "signalement";

const applyLanguage = (lang) => {
  currentLanguage = lang === "en" ? "en" : "fr";

  body.classList.toggle("lang-fr", currentLanguage === "fr");
  body.classList.toggle("lang-en", currentLanguage === "en");
  html.lang = currentLanguage;

  langButtons.forEach((button) => {
    const isActive = button.dataset.langBtn === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  window.localStorage.setItem("cv-language", currentLanguage);
};

const renderKpiList = (targetNode, values) => {
  if (!targetNode) {
    return;
  }

  targetNode.innerHTML = "";
  values.forEach((value) => {
    const li = document.createElement("li");
    li.textContent = value;
    targetNode.appendChild(li);
  });
};

const applyWorkflowStep = (step) => {
  if (!workflowData[step]) {
    return;
  }

  currentWorkflowStep = step;

  workflowButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.workflowStep === step);
    button.setAttribute("aria-selected", button.dataset.workflowStep === step ? "true" : "false");
  });

  const data = workflowData[step];

  if (workflowTitleFr) {
    workflowTitleFr.textContent = data.frTitle;
  }
  if (workflowTitleEn) {
    workflowTitleEn.textContent = data.enTitle;
  }
  if (workflowTextFr) {
    workflowTextFr.textContent = data.frText;
  }
  if (workflowTextEn) {
    workflowTextEn.textContent = data.enText;
  }

  renderKpiList(workflowKpisFr, data.frKpis);
  renderKpiList(workflowKpisEn, data.enKpis);
};

const animateCounter = (element) => {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  };

  requestAnimationFrame(frame);
};

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
);

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.55 }
);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.id;
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isMatch);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

const updateScrollProgress = () => {
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = height > 0 ? Math.min(top / height, 1) : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${ratio * 100}%`;
  }
};

let rafScheduled = false;
const onScroll = () => {
  if (rafScheduled) {
    return;
  }

  rafScheduled = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    rafScheduled = false;
  });
};

const setupMagnetic = () => {
  magneticElements.forEach((element) => {
    const strength = Number(element.dataset.magneticStrength || 8);

    element.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      const rect = element.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width;
      const relativeY = (event.clientY - rect.top) / rect.height;
      const offsetX = (relativeX - 0.5) * 2 * strength;
      const offsetY = (relativeY - 0.5) * 2 * strength;

      element.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      element.style.setProperty("--mx", `${Math.round(relativeX * 100)}%`);
      element.style.setProperty("--my", `${Math.round(relativeY * 100)}%`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "translate3d(0, 0, 0)";
      element.style.setProperty("--mx", "50%");
      element.style.setProperty("--my", "50%");
    });
  });
};

const setupRipples = () => {
  rippleTargets.forEach((element) => {
    element.addEventListener("click", (event) => {
      const rect = element.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      element.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });
};

const setupPresentationMode = () => {
  if (!presentationToggle) {
    return;
  }

  const saved = window.localStorage.getItem("cv-presentation-mode");
  const enabled = saved === "on";
  body.classList.toggle("presentation-mode", enabled);

  presentationToggle.addEventListener("click", () => {
    const isEnabled = !body.classList.contains("presentation-mode");
    body.classList.toggle("presentation-mode", isEnabled);
    window.localStorage.setItem("cv-presentation-mode", isEnabled ? "on" : "off");
  });
};

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.langBtn || "fr");
  });
});

workflowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyWorkflowStep(button.dataset.workflowStep);
  });
});

const initialLanguage = window.localStorage.getItem("cv-language") || "fr";
applyLanguage(initialLanguage);
applyWorkflowStep(currentWorkflowStep);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 22, 180)}ms`;
  revealObserver.observe(element);
});

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

navLinks.forEach((link) => {
  const target = link.getAttribute("href")?.replace("#", "");
  if (!target) {
    return;
  }
  const section = document.getElementById(target);
  if (!section) {
    return;
  }
  navObserver.observe(section);
});

setupMagnetic();
setupRipples();
setupPresentationMode();
updateScrollProgress();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateScrollProgress);
