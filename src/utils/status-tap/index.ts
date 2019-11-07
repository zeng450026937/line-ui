export const setupStatusTap = () => {
  const win = window;
  win.addEventListener('statusTap', () => {
    const width = win.innerWidth;
    const height = win.innerHeight;
    const el = document.elementFromPoint(width / 2, height / 2) as (Element | null);
    if (!el) {
      return;
    }
    const contentEl = el.closest('ion-content');
    if (contentEl) {
      (contentEl as any).scrollToTop(300);
    }
  });
};
