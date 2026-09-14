(() => {
  const settings = window.siteSettings || {};
  const custom = (settings.favicon || '').trim();
  if (!custom) return;
  document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach((node) => node.remove());
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = custom;
  document.head.appendChild(icon);
})();
