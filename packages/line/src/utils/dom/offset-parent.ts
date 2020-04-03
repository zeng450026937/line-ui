export const getOffsetParent = (element?: Element): Element => {
  if (!element) {
    return document.documentElement;
  }

  let offsetParent;

  /* eslint-disable-next-line prefer-destructuring */
  offsetParent = (element as HTMLElement).offsetParent;

  // Skip hidden elements which don't have an offsetParent
  while (offsetParent == null && element && element.nextElementSibling) {
    element = element.nextElementSibling as Element;
    /* eslint-disable-next-line prefer-destructuring */
    offsetParent = (element as HTMLElement).offsetParent;
  }

  if (!offsetParent) {
    return document.documentElement;
  }

  const { nodeName } = offsetParent;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return element.ownerDocument!.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (
    ['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 &&
    window.getComputedStyle(offsetParent).position === 'static'
  ) {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
};

export const getOffsetX = (el: HTMLElement) => {
  let offset = 0;
  while (el) {
    offset += el.offsetLeft;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
};
export const getOffsetY = (el: HTMLElement) => {
  let offset = 0;
  while (el) {
    offset += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
};
