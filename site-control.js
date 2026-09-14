(() => {
  async function load() {
    try {
      const response = await fetch('content/site.json', { cache: 'no-store' });
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
