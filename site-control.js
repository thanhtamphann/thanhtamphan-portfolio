(() => {
  const SETTINGS_URL = 'https://raw.githubusercontent.com/thanhtamphann/thanhtamphan-portfolio/main/_data/site.json';

  async function load() {
    try {
      const response = await fetch(`${SETTINGS_URL}?v=${Date.now()}`, { cache: 'no-store' });
      const settings = response.ok ? await response.json() : {};
      window.siteSettings = settings;
      window.siteLanguage = settings.defaultLanguage || 'en';
      window.dispatchEvent(new CustomEvent('site-settings-ready', { detail: settings }));
      return settings;
    } catch (_) {
      window.siteSettings = {};
      return {};
    }
  }

  window.siteSettingsReady = load();
})();
