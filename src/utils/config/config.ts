/* eslint-disable-next-line */
import { Mode } from '@/types/interface';

export interface SkylinConfig {
  /**
   * The mode determines which platform styles to use for the whole application.
   */
  mode?: Mode;
  /**
   * When it's set to `false`, disables all animation and transition across the app.
   * Can be useful to make ionic smoother in slow devices, when animations can't run smoothly.
   */
  animated?: boolean;

  /**
   * When it's set to `false`, it disables all material-design ripple-effects across the app.
   * Defaults to `true`.
   */
  rippleEffect?: boolean;

  spinner?: string;

  persistConfig?: boolean;
  testing?: boolean;
}

const startsWith = (input: string, search: string): boolean => {
  return input.substr(0, search.length) === search;
};

const SKYLINE_PREFIX = 'skyline:';
const SKYLINE_SESSION_KEY = 'skyline-persist-config';

export class Config {
  private m = new Map<keyof SkylinConfig, any>();

  reset(configObj: SkylinConfig) {
    this.m = new Map<keyof SkylinConfig, any>(Object.entries(configObj) as any);
  }

  get(key: keyof SkylinConfig, fallback?: any): any {
    const value = this.m.get(key);
    return (value !== undefined) ? value : fallback;
  }

  getBoolean(key: keyof SkylinConfig, fallback = false): boolean {
    const val = this.m.get(key);
    if (val === undefined) {
      return fallback;
    }
    if (typeof val === 'string') {
      return val === 'true';
    }
    return !!val;
  }

  getNumber(key: keyof SkylinConfig, fallback?: number): number {
    const val = parseFloat(this.m.get(key));
    return Number.isNaN(val) ? (fallback !== undefined ? fallback : NaN) : val;
  }

  set(key: keyof SkylinConfig, value: any) {
    this.m.set(key, value);
  }
}

export const config = new Config();

export const configFromSession = (win: Window): any => {
  try {
    const configStr = win.sessionStorage.getItem(SKYLINE_SESSION_KEY);
    return configStr !== null ? JSON.parse(configStr) : {};
  } catch (e) {
    return {};
  }
};

export const saveConfig = (win: Window, c: any) => {
  try {
    win.sessionStorage.setItem(SKYLINE_SESSION_KEY, JSON.stringify(c));
  } catch (e) {
    /* eslint-disable-next-line */
    return;
  }
};

export const configFromURL = (win: Window) => {
  const configObj: any = {};
  win.location.search.slice(1)
    .split('&')
    .map(entry => entry.split('='))
    .map(([key, value]) => [decodeURIComponent(key), decodeURIComponent(value)])
    .filter(([key]) => startsWith(key, SKYLINE_PREFIX))
    .map(([key, value]) => [key.slice(SKYLINE_PREFIX.length), value])
    .forEach(([key, value]) => {
      configObj[key] = value;
    });

  return configObj;
};