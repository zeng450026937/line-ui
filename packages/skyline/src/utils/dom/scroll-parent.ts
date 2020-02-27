export const getScrollParent = (element?: Element): Element => {
  if (!element) {
    return document.body;
  }

  const { nodeName } = element;

  if (nodeName === 'HTML' || nodeName === 'BODY') {
    return element.ownerDocument!.body;
  }
  if (nodeName === '#document') {
    return (element as any).body;
  }

  const { overflowY } = window.getComputedStyle(element);

  if (overflowY === 'scroll' || overflowY === 'auto') {
    return element;
  }

  return getScrollParent(element.parentNode as Element);
};
