(async () => {
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = resolve;
      document.body.appendChild(script);
    });
  }

  await loadScript('site-control.js?v=20260914-2');
  if (window.siteSettingsReady) await window.siteSettingsReady;
  await loadScript('branding.js?v=20260914-2');
  await loadScript('motion-settings.js?v=20260914-1');
  await loadScript('app-base.js?v=20260914-3');
  await loadScript('site-sync.js?v=20260914-2');
})();
