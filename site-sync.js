(() => {
  let caseStudies = [];

  function waitForPortfolio(callback, tries = 0) {
    try {
      if (typeof data !== 'undefined' && data && typeof render === 'function') return callback();
    } catch (_) {}
    if (tries < 100) setTimeout(() => waitForPortfolio(callback, tries + 1), 50);
  }

  function renderCaseStudies() {
    const grid = document.querySelector('.case-grid');
    if (!grid || !caseStudies.length) return;
    const lang = typeof language !== 'undefined' ? language : (window.siteLanguage || 'en');
    grid.innerHTML = caseStudies
      .filter((item) => item.enabled !== false)
      .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999))
      .map((item) => {
        const label = lang === 'vi' ? item.labelVi : item.labelEn;
        const title = lang === 'vi' ? item.titleVi : item.titleEn;
        const body = lang === 'vi' ? item.bodyVi : item.bodyEn;
        const image = item.image ? `<img src="${item.image}" alt="" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;margin-bottom:18px">` : '';
        const inner = `${image}<span class="case-label">${label || ''}</span><h3>${title || ''}</h3><p>${body || ''}</p>`;
        return item.url ? `<a class="case-card reveal visible" href="${item.url}">${inner}</a>` : `<article class="case-card reveal visible">${inner}</article>`;
      }).join('');
  }

  async function loadCaseStudies() {
    try {
      const response = await fetch('content/case-studies.json', { cache: 'no-cache' });
      if (response.ok) caseStudies = (await response.json()).items || [];
    } catch (_) {}
    renderCaseStudies();
  }

  function syncPortfolio() {
    const settings = window.siteSettings || {};
    if (settings.contact) data.contact = { ...(data.contact || {}), ...settings.contact };
    if (Array.isArray(data.projects)) {
      data.projects = data.projects
        .filter((project) => project.enabled !== false)
        .sort((a, b) => {
          const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
          if (featured) return featured;
          return (Number(a.order) || 999) - (Number(b.order) || 999);
        });
    }
    if (window.siteLanguage && (window.siteLanguage === 'en' || window.siteLanguage === 'vi')) language = window.siteLanguage;
    render();
    loadCaseStudies();
  }

  waitForPortfolio(syncPortfolio);

  document.querySelector('.language-toggle')?.addEventListener('click', () => {
    setTimeout(() => {
      try {
        window.siteLanguage = language;
        window.refreshSiteChrome?.(language);
        renderCaseStudies();
      } catch (_) {}
    }, 0);
  });
})();
