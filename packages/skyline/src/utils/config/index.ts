import { Mode } from 'skyline/src/types';
import { isPlatform } from 'skyline/src/utils/platform';
import {
  hasDocument,
  hasWindow,
} from 'skyline/src/utils/dom';
import {
  config,
  configFromSession,
  configFromURL,
  saveConfig,
  SkylinConfig,
} from 'skyline/src/utils/config/config';

// export config
export * from 'skyline/src/utils/config/config';

let defaultMode: Mode;

export const getMode = (elm?: HTMLElement | null): Mode => {
  while (elm) {
    const elmMode = elm.getAttribute('mode');

    if (elmMode) {
      return elmMode as Mode;
    }

    elm = elm.parentElement;
  }
  return defaultMode;
};

export function setupConfig(configObj?: SkylinConfig) {
  const win = (hasWindow && window) as Window;
  const doc = (hasDocument && document) as Document;

  let Skyline = {} as any;

  if (hasWindow) {
    Skyline = (win as any).Skyline || Skyline;
  }

  // create the Skyline.config from raw config object (if it exists)
  // and convert Skyline.config into a ConfigApi that has a get() fn
  configObj = {
    ...configObj,
    ...(hasWindow && configFromSession(win)),
    persistConfig : false,
    ...Skyline.config,
    ...(hasWindow && configFromURL(win)),
  };

  config.reset(configObj!);

  if (hasWindow && config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  const getModeFallback = () => {
    let fallback = 'ios';
    if (hasDocument && hasWindow) {
      fallback = (
        doc.documentElement.getAttribute('mode')
      ) || (
        isPlatform(win, 'android') ? 'md' : 'ios'
      );
    }
    return fallback;
  };

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by pre-rendering
  // otherwise get the mode via config settings, and fallback to ios
  Skyline.config = config;
  Skyline.mode = defaultMode = config.get('mode', getModeFallback());

  config.set('mode', defaultMode);

  if (hasDocument) {
    doc.documentElement.setAttribute('mode', defaultMode);
    doc.documentElement.classList.add(defaultMode);
  }

  if (config.getBoolean('testing')) {
    config.set('animated', false);
  }
}
