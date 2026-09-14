(() => {
  document.querySelectorAll('.desktop-nav,.mobile-nav').forEach((nav) => {
    if (!nav.querySelector('a[href="blog.html"]')) {
      const link = document.createElement('a');
      link.href = 'blog.html';
      link.textContent = 'Blog';
      nav.appendChild(link);
    }
  });

  ['branding.js?v=20260914-1', 'motion-settings.js?v=20260914-1', 'app-base.js?v=20260914-2'].forEach((src) => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  });
})();
