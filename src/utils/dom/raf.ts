export const raf = (h: FrameRequestCallback) => {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export const doubleRaf = (h: FrameRequestCallback) => {
  raf(() => raf(h));
};

export const cancelRaf = (id: number) => {
  if (typeof cancelAnimationFrame === 'function') {
    return cancelAnimationFrame(id);
  }
  return clearTimeout(id);
};
