// Cross-browser support as described in:
// https://stackoverflow.com/questions/1248081
export const getClientWidth = () => {
  if (typeof document === 'undefined') return 0; // SSR

  return Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0,
  );
};

export const getClientHeight = () => {
  if (typeof document === 'undefined') return 0; // SSR

  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
  );
};
