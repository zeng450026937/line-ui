/* eslint-disable-next-line */
import { Mode } from 'skyline/types/interface';
import { isPlatform } from 'skyline/src/utils/platform';
import {
  config,
  configFromSession,
  configFromURL,
  saveConfig,
} from 'skyline/src/utils/config/config';
// export config
export * from 'skyline/src/utils/config/config';

let defaultMode: Mode;

export const getMode = (elm: any) => {
  while (elm) {
    const elmMode = (elm as any).mode || elm.getAttribute('mode');

    if (elmMode) {
      return elmMode;
    }

    elm = elm.parentElement;
  }
  return defaultMode;
};

export const getSkylineMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
};

export function setupConfig() {
  const doc = document;
  const win = window;
  const Skyline = (win as any).Skyline = (win as any).Skyline || {};

  // create the Skyline.config from raw config object (if it exists)
  // and convert Skyline.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistConfig : false,
    ...Skyline.config,
    ...configFromURL(win),
  };

  config.reset(configObj);

  if (config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by pre-rendering
  // otherwise get the mode via config settings, and fallback to ios
  Skyline.config = config;
  Skyline.mode = defaultMode = config.get(
    'mode',
    (doc.documentElement.getAttribute('mode')) || (isPlatform(win, 'android') ? 'md' : 'ios'),
  );
  config.set('mode', defaultMode);
  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);

  if (config.getBoolean('testing')) {
    config.set('animated', false);
  }
}
