export async function scrollToPoint(
  scrollEl: HTMLElement = (document.scrollingElement as HTMLElement | null) ||
    document.body ||
    document.documentElement,
  x: number | undefined | null,
  y: number | undefined | null,
  duration = 0
) {
  if (duration < 32) {
    if (y != null) {
      scrollEl.scrollTop = y;
    }
    if (x != null) {
      scrollEl.scrollLeft = x;
    }
    return;
  }

  let resolve!: () => void;
  let startTime = 0;
  const promise = new Promise<void>((r) => (resolve = r));
  const fromY = scrollEl.scrollTop;
  const fromX = scrollEl.scrollLeft;

  const deltaY = y != null ? y - fromY : 0;
  const deltaX = x != null ? x - fromX : 0;

  // scroll loop
  const step = (timeStamp: number) => {
    const linearTime = Math.min(1, (timeStamp - startTime) / duration) - 1;
    /* eslint-disable-next-line */
    const easedT = Math.pow(linearTime, 3) + 1;

    if (deltaY !== 0) {
      scrollEl.scrollTop = Math.floor(easedT * deltaY + fromY);
    }
    if (deltaX !== 0) {
      scrollEl.scrollLeft = Math.floor(easedT * deltaX + fromX);
    }

    if (easedT < 1) {
      // do not use DomController here
      // must use nativeRaf in order to fire in the next frame
      // TODO: remove as any
      requestAnimationFrame(step);
    } else {
      resolve();
    }
  };
  // chill out for a frame first
  requestAnimationFrame((ts) => {
    startTime = ts;
    step(ts);
  });

  await promise;
}

export async function scrollToTop(scrollEl: HTMLElement, duration?: number) {
  await scrollToPoint(scrollEl, undefined, 0, duration);
}

export async function scrollToBottom(scrollEl: HTMLElement, duration?: number) {
  const y = scrollEl.scrollHeight - scrollEl.clientHeight;
  await scrollToPoint(scrollEl, undefined, y, duration);
}

export async function scrollByPoint(
  scrollEl: HTMLElement,
  x: number,
  y: number,
  duration?: number
) {
  await scrollToPoint(
    scrollEl,
    x + scrollEl.scrollLeft,
    y + scrollEl.scrollTop,
    duration
  );
}

const getOffsetX = (el: HTMLElement) => {
  let offset = 0;
  while (el) {
    offset += el.offsetLeft;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
};
const getOffsetY = (el: HTMLElement) => {
  let offset = 0;
  while (el) {
    offset += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }
  return offset;
};

export async function scrollToElement(
  scrollEl: HTMLElement,
  el?: HTMLElement | null,
  duration?: number
) {
  if (!el) return;
  const x = getOffsetX(el) - getOffsetX(scrollEl);
  const y = getOffsetY(el) - getOffsetY(scrollEl);
  await scrollByPoint(scrollEl, x, y, duration);
}
