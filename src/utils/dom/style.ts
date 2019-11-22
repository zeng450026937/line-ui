export function isHidden(element: HTMLElement) {
  return (
    window.getComputedStyle(element).display === 'none' || element.offsetParent === null
  );
}

export function getZIndex(el?: Element | null): number {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0;

  const index = +window.getComputedStyle(el).getPropertyValue('z-index');

  if (!index) return getZIndex(el.parentNode as Element);
  return index;
}
