(() => {
  function waitForPortfolio(callback, tries = 0) {
    try {
      if (typeof data !== 'undefined' && data && typeof render === 'function') return callback();
    } catch (_) {}
    if (tries < 100) setTimeout(() => waitForPortfolio(callback, tries + 1), 50);
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
  }

  waitForPortfolio(syncPortfolio);

  document.querySelector('.language-toggle')?.addEventListener('click', () => {
    setTimeout(() => {
      try {
        window.siteLanguage = language;
        window.refreshSiteChrome?.(language);
      } catch (_) {}
    }, 0);
  });
})();
