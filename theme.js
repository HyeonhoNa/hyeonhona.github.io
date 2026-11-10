(() => {
  const storageKey = 'hyeonho-na-theme';
  const standalone = document.documentElement.dataset.researchHomepage === 'true';
  const validTheme = (value) => value === 'light' || value === 'dark';
  const savedWidgetTheme = () => window.openai?.widgetState?.privateContent?.theme;
  let theme = 'dark';
  if (standalone) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (validTheme(saved)) theme = saved;
    } catch { /* The switch still works when browser storage is unavailable. */ }
    document.documentElement.dataset.theme = theme;
  } else if (validTheme(savedWidgetTheme())) {
    theme = savedWidgetTheme();
  }

  const bindTheme = () => {
    const root = document.getElementById('concept-refined');
    const toggle = root?.querySelector('.rf-theme-toggle');
    if (!toggle || root.dataset.themeBound === 'true') return;
    root.dataset.themeBound = 'true';
    const render = () => {
      root.dataset.theme = theme;
      if (standalone) document.documentElement.dataset.theme = theme;
      toggle.setAttribute('aria-label', theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환');
      toggle.dataset.tooltip = theme === 'dark' ? 'Light theme' : 'Dark theme';
    };
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      render();
      if (standalone) {
        try { localStorage.setItem(storageKey, theme); } catch { /* Storage is optional. */ }
      } else if (window.openai?.setWidgetState) {
        window.openai.setWidgetState({ modelContent: { theme }, privateContent: { theme } }).catch(() => {});
      }
    });
    if (!standalone) {
      window.addEventListener('openai:set_globals', (event) => {
        const saved = event.detail?.globals?.widgetState?.privateContent?.theme;
        if (validTheme(saved)) {
          theme = saved;
          render();
        }
      });
    }
    render();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindTheme, { once: true });
  else bindTheme();
})();
