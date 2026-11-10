(() => {
  const root = document.getElementById('research-designs');
  const section = root && root.querySelector('#refined-papers');
  if (!section || section.dataset.previewBound === 'true') return;
  section.dataset.previewBound = 'true';
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const closePreviews = [];
  section.querySelectorAll('.rf-pub-row').forEach((row) => {
    const toggle = row.querySelector('.rf-pub-toggle');
    const thumb = row.querySelector('.rf-pub-thumb');
    const expandedFigure = row.querySelector('.rf-pub-expanded');
    const copy = row.querySelector('.rf-pub-copy');
    if (!toggle || !thumb || !expandedFigure || !copy) return;
    let hovering = false;
    let pinned = false;
    let suppressHover = false;
    let expanded = false;
    const render = () => {
      expanded = pinned || (hovering && !suppressHover);
      row.classList.toggle('is-expanded', expanded);
      thumb.hidden = expanded;
      expandedFigure.hidden = !expanded;
      copy.hidden = expanded;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', row.dataset.publication + (expanded ? '의 이미지 축소 및 논문 정보 보기' : '의 이미지 확대'));
    };
    toggle.addEventListener('pointerenter', (event) => {
      if (finePointer.matches && event.pointerType !== 'touch') {
        hovering = true;
        render();
      }
    });
    toggle.addEventListener('pointerleave', () => {
      hovering = false;
      suppressHover = false;
      render();
    });
    toggle.addEventListener('click', () => {
      if (expanded) {
        pinned = false;
        suppressHover = true;
      } else {
        pinned = true;
      }
      render();
    });
    closePreviews.push(() => {
      if (!expanded) return false;
      const restoreFocus = row.contains(document.activeElement);
      pinned = false;
      suppressHover = true;
      render();
      if (restoreFocus) toggle.focus({ preventScroll: true });
      return true;
    });
    row.addEventListener('focusout', (event) => {
      if (!row.contains(event.relatedTarget)) {
        pinned = false;
        render();
      }
    });
    finePointer.addEventListener('change', () => {
      hovering = false;
      suppressHover = false;
      render();
    });
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    let closed = false;
    closePreviews.forEach((close) => { closed = close() || closed; });
    if (closed) event.preventDefault();
  });
})();
