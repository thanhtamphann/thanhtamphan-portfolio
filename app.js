let data = null;
let translations = null;
let language = "en";
let activeFilter = "All";

function t(key) {
  return translations?.[language]?.[key] || key;
}

function renderStaticText() {
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll(".language-toggle span").forEach((span) => {
    span.classList.toggle("active", span.textContent.toLowerCase() === language);
  });
}

function renderStats() {
  document.querySelector("#stats").innerHTML = data.stats.map((stat) => `
    <div class="stat">
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat[language]}</div>
    </div>`).join("");
}

function renderFilters() {
  const categories = ["All", ...new Set(data.projects.map((project) => project.category))];
  document.querySelector("#filters").innerHTML = categories.map((category) => `
    <button class="filter-btn ${activeFilter === category ? "active" : ""}" type="button" data-filter="${category}">
      ${category === "All" ? t("all") : category}
    </button>`).join("");
  document.querySelectorAll(".filter-btn").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderFilters();
    renderProjects();
  }));
}

function getYouTubeId(project) {
  if (project.videoId) return project.videoId;
  if (!project.videoUrl) return "";

  try {
    const url = new URL(project.videoUrl);
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) => part === "shorts" || part === "embed");
    return marker >= 0 ? parts[marker + 1] || "" : "";
  } catch {
    return "";
  }
}

function renderProjects() {
  const projects = activeFilter === "All" ? data.projects : data.projects.filter((project) => project.category === activeFilter);
  document.querySelector("#project-grid").innerHTML = projects.map((project, index) => {
    const videoId = getYouTubeId(project);
    const videoUrl = project.videoUrl || `https://www.youtube.com/watch?v=${videoId}`;
    const youtubeImage = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const image = project.image || youtubeImage;
    const fallback = project.image ? youtubeImage : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const secondaryMetric = project.likes || project.averageViews;
    const secondaryLabel = project.likes ? t("likesLabel") : t("averageViewsLabel");
    const secondaryMarkup = secondaryMetric ? `<div><strong>${secondaryMetric}</strong><span>${secondaryLabel}</span></div>` : "";

    return `
      <article class="project-card reveal visible">
        <a class="project-image" href="${videoUrl}" target="_blank" rel="noreferrer" aria-label="${t("watch")}: ${project.title}">
          <img src="${image}" onerror="this.onerror=null;this.src='${fallback}'" alt="Thumbnail for ${project.title}" loading="lazy" />
          <span class="view-badge">${project.views} ${t("viewsShort")}</span><span class="play" aria-hidden="true">▶</span>
        </a>
        <div class="project-meta"><span>${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}</span><span>${project.category}</span></div>
        <h3><a href="${videoUrl}" target="_blank" rel="noreferrer">${project.title}</a></h3>
        <p>${project[language]}</p>
        <div class="project-performance" aria-label="${t("performanceLabel")}">
          <div><strong>${project.views}</strong><span>${t("viewsLabel")}</span></div>
          ${secondaryMarkup}
        </div>
      </article>`;
  }).join("");
}

function renderExpertise() {
  document.querySelector("#expertise-grid").innerHTML = data.expertise.map((item, index) => `
    <article class="expertise-item reveal">
      <span class="num">0${index + 1}</span><h3>${item.title[language]}</h3><p>${item.body[language]}</p>
    </article>`).join("");
}

function renderProcess() {
  document.querySelector("#process-list").innerHTML = data.process.map((item) => `
    <li class="process-step reveal"><h3>${item.title[language]}</h3><p>${item.body[language]}</p></li>`).join("");
}

function renderTags() {
  document.querySelector("#about-tags").innerHTML = data.tags.map((tag) => `<span class="about-tag">${tag}</span>`).join("");
}

function renderPortrait() {
  const portrait = document.querySelector("#about-portrait");
  if (data.profile?.image) {
    portrait.innerHTML = `<img src="${data.profile.image}" alt="${data.profile.alt || "Thanh Tam Phan"}" loading="lazy" />`;
    portrait.classList.add("has-image");
    return;
  }
  portrait.innerHTML = "<span>TTP</span>";
  portrait.classList.remove("has-image");
}

function renderContact() {
  const links = [];
  if (data.contact.github) links.push({ label: t("github"), url: data.contact.github });
  if (data.contact.email) links.push({ label: t("email"), url: `mailto:${data.contact.email}` });
  if (data.contact.linkedin) links.push({ label: t("linkedin"), url: data.contact.linkedin });
  document.querySelector("#contact-links").innerHTML = links.map((link) => `<a class="contact-link" href="${link.url}" target="_blank" rel="noreferrer"><span>${link.label}</span><span>↗</span></a>`).join("");
}

function activateReveal() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll(".reveal:not(.visible)").forEach((element) => observer.observe(element));
}

function render() {
  if (!data || !translations) return;
  renderStaticText();
  renderStats();
  renderFilters();
  renderProjects();
  renderExpertise();
  renderProcess();
  renderTags();
  renderPortrait();
  renderContact();
  activateReveal();
}

async function loadContent() {
  const [portfolioResponse, copyResponse] = await Promise.all([
    fetch("content/portfolio.json", { cache: "no-cache" }),
    fetch("content/copy.json", { cache: "no-cache" })
  ]);

  if (!portfolioResponse.ok || !copyResponse.ok) {
    throw new Error("The portfolio content could not be loaded.");
  }

  [data, translations] = await Promise.all([
    portfolioResponse.json(),
    copyResponse.json()
  ]);
  render();
}

document.querySelector(".language-toggle").addEventListener("click", () => {
  language = language === "en" ? "vi" : "en";
  render();
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const open = document.body.classList.toggle("menu-open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".mobile-nav a").forEach((link) => link.addEventListener("click", () => document.body.classList.remove("menu-open")));
document.querySelector("#year").textContent = new Date().getFullYear();

loadContent().catch((error) => {
  console.error(error);
  document.querySelector("#project-grid").innerHTML = "<p>Content is temporarily unavailable. Please refresh the page.</p>";
});
