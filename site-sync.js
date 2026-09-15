(() => {
  let editableCases = [];
  fetch('content/cases.json', { cache: 'no-store' })
    .then(response => response.ok ? response.json() : {})
    .then(payload => { editableCases = payload.items || []; if (window.renderEditableCases) window.renderEditableCases(); })
    .catch(() => {});








  function waitForPortfolio(callback, tries = 0) {
    try {
      if (typeof data !== 'undefined' && data && typeof render === 'function') return callback();
    } catch (_) {}
    if (tries < 100) setTimeout(() => waitForPortfolio(callback, tries + 1), 50);
  }








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








  function applySEO(settings) {
    const seo = settings.seo || {};
    if (seo.title) document.title = seo.title;
    setMeta('description', seo.description || settings.siteDescription || '');
    setMeta('og:title', seo.title || settings.siteTitle || '', true);
    setMeta('og:description', seo.description || settings.siteDescription || '', true);
    const shareImage = settings.ogImage ? new URL(settings.ogImage, window.location.origin).href : '';
    setMeta('og:image', shareImage, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:image', shareImage);
  }








  function applyBrand(settings) {
    const logo = (settings.logoText || 'TTP').trim() || 'TTP';
    document.querySelectorAll('.wordmark').forEach(node => {
      const head = logo.slice(0, Math.max(1, logo.length - 1));
      const tail = logo.slice(-1);
      node.innerHTML = `${head}<span>${tail}</span>`;
    });
    const footer = document.querySelector('.site-footer p:first-child');
    if (footer && settings.siteTitle) footer.textContent = `© ${new Date().getFullYear()} ${settings.siteTitle}`;
  }








  function applyTheme(settings) {
    const colors = settings.colors || {};
    const map = { paper: '--paper', paperSoft: '--paper-soft', ink: '--ink', acid: '--acid', coral: '--coral', blue: '--blue' };
    Object.entries(map).forEach(([key, cssVar]) => colors[key] && document.documentElement.style.setProperty(cssVar, colors[key]));
    document.body.dataset.theme = settings.theme || 'original';
  }








  function applyChrome(settings, currentLanguage) {
    const lang = currentLanguage || 'en';
    if (Array.isArray(settings.navigation) && settings.navigation.length) {
      const navItems = settings.navigation.filter(item => item.enabled !== false);
      const navHtml = navItems.map(item => {
        const label = lang === 'vi' ? (item.labelVi || item.labelEn) : (item.labelEn || item.labelVi);
        return `<a href="${item.url}"${item.newTab ? ' target="_blank" rel="noreferrer"' : ''}>${label || ''}</a>`;
      }).join('');
      document.querySelectorAll('.desktop-nav,.mobile-nav').forEach(nav => nav.innerHTML = navHtml);
    }








    document.querySelector('.site-announcement')?.remove();
    const notice = settings.announcement;
    if (notice?.enabled) {
      const node = document.createElement(notice.url ? 'a' : 'div');
      node.className = 'site-announcement';
      node.textContent = lang === 'vi' ? notice.textVi : notice.textEn;
      if (notice.url) { node.href = notice.url; if (notice.newTab) { node.target = '_blank'; node.rel = 'noreferrer'; } }
      document.body.prepend(node);
    }








    document.querySelector('.global-cta-row')?.remove();
    const cta = settings.cta || {};
    const buttons = [];
    if (cta.primaryEnabled && cta.primaryUrl) buttons.push([lang === 'vi' ? cta.primaryLabelVi : cta.primaryLabelEn, cta.primaryUrl, true]);
    if (cta.secondaryEnabled && cta.secondaryUrl) buttons.push([lang === 'vi' ? cta.secondaryLabelVi : cta.secondaryLabelEn, cta.secondaryUrl, false]);
    const heroBottom = document.querySelector('.hero-bottom');
    if (heroBottom && buttons.length) {
      const row = document.createElement('div');
      row.className = 'global-cta-row';
      row.innerHTML = buttons.map(button => `<a class="global-cta ${button[2] ? 'primary' : ''}" href="${button[1]}">${button[0] || ''}</a>`).join('');
      heroBottom.appendChild(row);
    }
  }








  function applySections(settings) {
    const map = { hero: '.hero', results: '#results', stats: '#stats', work: '#work', 'case-studies': '#case-studies', expertise: '#expertise', tools: '#tools', manifesto: '.manifesto', process: '#process', about: '#about', contact: '#contact' };
    const main = document.querySelector('main');
    (settings.sections || []).forEach(item => {
      const node = document.querySelector(map[item.id] || `#${item.id}`);
      if (!node) return;
      node.hidden = item.enabled === false;
      main?.appendChild(node);
    });
  }








  function renderCases(currentLanguage) {
    if (!editableCases.length) return;
    const grid = document.querySelector('.case-grid');
    if (!grid) return;
    const lang = currentLanguage || 'en';
    const cases = editableCases.filter(item => item.enabled !== false).sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
    grid.innerHTML = cases.map(item => `
      <article class="case-card reveal visible">
        <span class="case-label">${lang === 'vi' ? (item.labelVi || item.labelEn) : (item.labelEn || item.labelVi)}</span>
        <h3>${lang === 'vi' ? (item.titleVi || item.titleEn) : (item.titleEn || item.titleVi)}</h3>
        <p>${lang === 'vi' ? (item.bodyVi || item.bodyEn) : (item.bodyEn || item.bodyVi)}</p>
      </article>`).join('');
  }








  window.renderEditableCases = () => {
    try { renderCases(typeof language !== 'undefined' ? language : (window.siteLanguage || 'en')); } catch (_) {}
  };








  function applyProfilePhoto(settings) {
    const source = settings.profilePhoto || data.profile?.image;
    if (!source) return;
    document.querySelectorAll('.hero-photo, .about-portrait').forEach((container, index) => {
      const image = document.createElement('img');
      image.src = source;
      image.alt = data.profile?.alt || settings.siteTitle || 'Portrait';
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.decoding = 'async';
      container.replaceChildren(image);
      container.classList.add('has-image');
    });
  }








  function applyHeroIdentity(settings) {
    const name = String(settings.siteTitle || document.body.dataset.heroName || '').trim();
    let node = document.querySelector('.hero-name');
    const heading = document.querySelector('.hero-main h1');
    if (name && heading) {
      if (!node) {
        node = document.createElement('p');
        node.className = 'hero-name reveal visible';
        heading.before(node);
      }
      node.textContent = name;
    } else {
      node?.remove();
    }
    document.querySelector('.hero-photo-note')?.remove();
  }


  function syncPortfolio() {
    const settings = window.siteSettings || {};
    if (settings.contact) data.contact = { ...(data.contact || {}), ...settings.contact };
    if (settings.profilePhoto) data.profile = { ...(data.profile || {}), image: settings.profilePhoto };
    if (Array.isArray(data.projects)) {
      data.projects = data.projects.filter(project => project.enabled !== false).sort((a, b) => {
        const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        return featured || ((Number(a.order) || 999) - (Number(b.order) || 999));
      });
    }
    if (window.siteLanguage && (window.siteLanguage === 'en' || window.siteLanguage === 'vi')) language = window.siteLanguage;
    render();
    applyHeroIdentity(settings);
    applySEO(settings);
    applyBrand(settings);
    applyTheme(settings);
    applyChrome(settings, language);
    applySections(settings);
    applyProfilePhoto(settings);
    renderCases(language);
  }








  window.refreshSiteChrome = function(nextLanguage) {
    const settings = window.siteSettings || {};
    applyHeroIdentity(settings);
    applyChrome(settings, nextLanguage || language || 'en');
    applyProfilePhoto(settings);
    renderCases(nextLanguage || language || 'en');
  };








  Promise.resolve(window.siteSettingsReady).finally(() => waitForPortfolio(syncPortfolio));
  document.querySelector('.language-toggle')?.addEventListener('click', () => setTimeout(() => {
    try { window.siteLanguage = language; window.refreshSiteChrome(language); } catch (_) {}
  }, 0));
})();
