export interface SkylinConfig {
  rippleEffect?: boolean;
  overlay?: boolean;
}

export function setupConfig(config: SkylinConfig) {
  const win = window as any;
  const { Skyline } = win;
  if (Skyline && Skyline.config && Skyline.config.constructor.name !== 'Object') {
    console.error('ionic config was already initialized');
    return null;
  }
  win.Skyline = win.Skyline || {};
  win.Skyline.config = {
    ...win.Skyline.config,
    ...config,
  };
  return win.Skyline.config;
}

export function getMode() {
  const win = window as any;
  const config = win && win.Ionic && win.Ionic.config;
  if (config) {
    if (config.mode) {
      return config.mode;
    }
    return config.get('mode');
  }
  return 'md';
}
