export const testUserAgent = (win: Window, expr: RegExp) => expr.test(win.navigator.userAgent);

const matchMedia = (win: Window, query: string): boolean => win.matchMedia(query).matches;

export const isMobile = (win: Window) => matchMedia(win, '(any-pointer:coarse)');

export const isDesktop = (win: Window) => !isMobile(win);

export const isIpad = (win: Window) => {
// iOS 12 and below
  if (testUserAgent(win, /iPad/i)) {
    return true;
  }

  // iOS 13+
  if (testUserAgent(win, /Macintosh/i) && isMobile(win)) {
    return true;
  }

  return false;
};

export const isIphone = (win: Window) => testUserAgent(win, /iPhone/i);

export const isIOS = (win: Window) => testUserAgent(win, /iPhone|iPod/i) || isIpad(win);

export const isAndroid = (win: Window) => testUserAgent(win, /android|sink/i);

export const isAndroidTablet = (win: Window) => {
  return isAndroid(win) && !testUserAgent(win, /mobile/i);
};

export const isPhablet = (win: Window) => {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (smallest > 390 && smallest < 520)
  && (largest > 620 && largest < 800);
};

export const isTablet = (win: Window) => {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (
    isIpad(win)
  || isAndroidTablet(win)
  || (
    (smallest > 460 && smallest < 820)
    && (largest > 780 && largest < 1400)
  )
  );
};

export const isCordova = (win: any): boolean => !!(win.cordova || win.phonegap || win.PhoneGap);

export const isCapacitorNative = (win: any): boolean => {
  const capacitor = win.Capacitor;
  return !!(capacitor && capacitor.isNative);
};

export const isHybrid = (win: Window) => isCordova(win) || isCapacitorNative(win);

export const isMobileWeb = (win: Window): boolean => isMobile(win) && !isHybrid(win);

export const isElectron = (win: Window): boolean => testUserAgent(win, /electron/i);

export const isPWA = (win: Window): boolean => !!(win.matchMedia('(display-mode: standalone)').matches || (win.navigator as any).standalone);

const PLATFORMS_MAP = {
  ipad      : isIpad,
  iphone    : isIphone,
  ios       : isIOS,
  android   : isAndroid,
  phablet   : isPhablet,
  tablet    : isTablet,
  cordova   : isCordova,
  capacitor : isCapacitorNative,
  electron  : isElectron,
  pwa       : isPWA,
  mobile    : isMobile,
  mobileweb : isMobileWeb,
  desktop   : isDesktop,
  hybrid    : isHybrid,
};

export type Platforms = keyof typeof PLATFORMS_MAP;

interface IsPlatformSignature {
  (plt: Platforms): boolean;
  (win: Window, plt: Platforms): boolean;
}

/* eslint-disable max-len */
const detectPlatforms = (win: Window) => (Object.keys(PLATFORMS_MAP) as Platforms[]).filter(p => PLATFORMS_MAP[p](win));

export const setupPlatforms = (win: any = window) => {
  win.Skyline = win.Skyline || {};

  let { platforms } = win.Skyline;
  if (platforms == null) {
    platforms = win.Skyline.platforms = detectPlatforms(win);
    platforms.forEach((p: Platforms) => win.document.documentElement.classList.add(`plt-${ p }`));
  }
  return platforms;
};

export const getPlatforms = (win: any) => setupPlatforms(win);

export const isPlatform: IsPlatformSignature = (winOrPlatform: Window | Platforms | undefined, platform?: Platforms) => {
  if (typeof winOrPlatform === 'string') {
    platform = winOrPlatform;
    winOrPlatform = undefined;
  }
  return getPlatforms(winOrPlatform).includes(platform!);
};
