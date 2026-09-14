(async () => {
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#11110f"/><text x="32" y="39" text-anchor="middle" font-family="Georgia,serif" font-size="23" font-weight="700" fill="#f0eee8">TTP</text><circle cx="50" cy="14" r="5" fill="#c9ff3d"/></svg>`;
  const fallback = `data:image/svg+xml,${encodeURIComponent(fallbackSvg)}`;
  let href = fallback;
  try {
    const response = await fetch('content/site.json', { cache: 'no-cache' });
    if (response.ok) {
      const settings = await response.json();
      if (settings.favicon && settings.favicon.trim()) href = settings.favicon.trim();
    }
  } catch (_) {}
  document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach((node) => node.remove());
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.href = href;
  document.head.appendChild(icon);
})();
