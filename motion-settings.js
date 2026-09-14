(async () => {
  const defaults = { enabled: true, intensity: 'medium', heroText: true, scrollReveal: true, hoverEffects: true, statAnimation: true };
  let motion = defaults;
  try {
    const response = await fetch('content/motion.json', { cache: 'no-cache' });
    if (response.ok) motion = { ...defaults, ...(await response.json()) };
  } catch (_) {}

  document.documentElement.dataset.motionIntensity = motion.intensity || 'medium';
  const rules = [];
  if (!motion.enabled) {
    rules.push('*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}');
  } else {
    if (!motion.heroText) rules.push('.hero h1.reveal.visible>span,.hero h1.reveal.visible>em{animation:none!important;opacity:1!important;transform:none!important;filter:none!important}');
    if (!motion.scrollReveal) rules.push('.reveal{opacity:1!important;transform:none!important}');
    if (!motion.hoverEffects) rules.push('.project-card:hover,.stat:hover .stat-value,.project-card:hover h3,.expertise-item:hover h3,.process-step:hover h3,.about-tag:hover,.filter-btn:hover,.contact-link:hover{transform:none!important}');
    if (!motion.statAnimation) rules.push('.stats.visible .stat{animation:none!important;opacity:1!important;transform:none!important}');
    if (motion.intensity === 'subtle') rules.push('.reveal{transition-duration:.45s!important}.project-card:hover{transform:translateY(-3px)!important}');
    if (motion.intensity === 'strong') rules.push('.reveal{transition-duration:.95s!important}.project-card:hover{transform:translateY(-11px)!important}.hero h1.reveal.visible>span,.hero h1.reveal.visible>em{animation-duration:1.2s!important}');
  }
  if (rules.length) {
    const style = document.createElement('style');
    style.id = 'motion-settings-style';
    style.textContent = rules.join('\n');
    document.head.appendChild(style);
  }
})();
