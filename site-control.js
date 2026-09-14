(() => {
  const CONFIG_URL = '_data/site.json';

  function setMeta(name, content, property = false) {
    if (!content) return;
    const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let node = document.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      node.setAttribute(property ? 'property' : 'name', name);
      document.head.appendChild(node);
    }
    node.setAttribute('content', content);
  }

  function injectAnnouncement(settings, language = 'en') {
    document.querySelector('.site-announcement')?.remove();
    const item = settings?.announcement;
    if (!item?.enabled) return;
    const text = language === 'vi' ? item.textVi : item.textEn;
    if (!text) return;
    const bar = document.createElement(item.url ? 'a' : 'div');
    bar.className = 'site-announcement';
    bar.textContent = text;
    if (item.url) {
      bar.href = item.url;
      if (item.newTab) { bar.target = '_blank'; bar.rel = 'noreferrer'; }
    }
    document.body.prepend(bar);
  }

  function renderNavigation(settings, language = 'en') {
    const items = (settings.navigation || []).filter((item) => item.enabled !== false);
    document.querySelectorAll('.desktop-nav,.mobile-nav').forEach((nav) => {
      nav.innerHTML = items.map((item) => {
        const label = language === 'vi' ? item.labelVi : item.labelEn;
        const target = item.newTab ? ' target="_blank" rel="noreferrer"' : '';
        return `<a href="${item.url}"${target}>${label || item.labelEn || item.url}</a>`;
      }).join('');
    });
  }

  function applySections(settings) {
    const main = document.querySelector('main');
    if (!main) return;
    const aliases = {
      'hero': '#top',
      'results': '#results',
      'stats': '#stats',
      'work': '#work',
      'case-studies': '#case-studies',
      'expertise': '#expertise',
      'tools': '#tools',
      'manifesto': '.manifesto',
      'process': '#process',
      'about': '#about',
      'contact': '#contact'
    };
    (settings.sections || []).forEach((section) => {
      const node = document.querySelector(aliases[section.id] || `#${section.id}`);
      if (!node) return;
      node.hidden = section.enabled === false;
      main.appendChild(node);
    });
  }

  function applyTheme(settings) {
    const colors = settings.colors || {};
    const root = document.documentElement;
    const map = { paper: '--paper', paperSoft: '--paper-soft', ink: '--ink', acid: '--acid', coral: '--coral', blue: '--blue' };
    Object.entries(map).forEach(([key, cssVar]) => { if (colors[key]) root.style.setProperty(cssVar, colors[key]); });
    document.body.dataset.theme = settings.theme || 'original';
  }

  function applySEO(settings) {
    const seo = settings.seo || {};
    if (seo.title) document.title = seo.title;
    setMeta('description', seo.description || settings.siteDescription);
    setMeta('og:title', seo.title || settings.siteTitle, true);
    setMeta('og:description', seo.description || settings.siteDescription, true);
    setMeta('og:image', seo.socialImage || settings.ogImage, true);
  }

  function renderCTA(settings, language = 'en') {
    document.querySelector('.global-cta-row')?.remove();
    const cta = settings.cta || {};
    const items = [];
    if (cta.primaryEnabled && cta.primaryUrl) items.push({ label: language === 'vi' ? cta.primaryLabelVi : cta.primaryLabelEn, url: cta.primaryUrl, primary: true });
    if (cta.secondaryEnabled && cta.secondaryUrl) items.push({ label: language === 'vi' ? cta.secondaryLabelVi : cta.secondaryLabelEn, url: cta.secondaryUrl, primary: false });
    if (!items.length) return;
    const heroBottom = document.querySelector('.hero-bottom');
    if (!heroBottom) return;
    const row = document.createElement('div');
    row.className = 'global-cta-row';
    row.innerHTML = items.map((item) => `<a class="global-cta ${item.primary ? 'primary' : ''}" href="${item.url}">${item.label || ''}</a>`).join('');
    heroBottom.appendChild(row);
  }

  function applyBrand(settings) {
    document.querySelectorAll('.wordmark').forEach((node) => {
      const text = settings.logoText || 'TTP';
      node.innerHTML = `${text.slice(0, Math.max(1, text.length - 1))}<span>${text.slice(-1)}</span>`;
    });
  }

  function applySharedContact(settings) {
    if (!window.portfolioDataOverride) window.portfolioDataOverride = {};
    window.portfolioDataOverride.contact = settings.contact || {};
  }

  async function loadSiteSettings() {
    let settings = {};
    try {
      const response = await fetch(CONFIG_URL, { cache: 'no-cache' });
      if (response.ok) settings = await response.json();
    } catch (_) {}
    window.siteSettings = settings;
    window.siteLanguage = settings.defaultLanguage || 'en';
    applySharedContact(settings);
    applyTheme(settings);
    applySEO(settings);
    applyBrand(settings);
    renderNavigation(settings, window.siteLanguage);
    applySections(settings);
    injectAnnouncement(settings, window.siteLanguage);
    renderCTA(settings, window.siteLanguage);
    window.dispatchEvent(new CustomEvent('site-settings-ready', { detail: settings }));
  }

  window.refreshSiteChrome = function(language) {
    const settings = window.siteSettings || {};
    window.siteLanguage = language || window.siteLanguage || settings.defaultLanguage || 'en';
    renderNavigation(settings, window.siteLanguage);
    injectAnnouncement(settings, window.siteLanguage);
    renderCTA(settings, window.siteLanguage);
  };

  window.siteSettingsReady = loadSiteSettings();
})();
