import { Mode } from '@line-ui/line/src/types';
import { isPlatform } from '@line-ui/line/src/utils/platform';
import { hasDocument, hasWindow } from '@line-ui/line/src/utils/dom';
import {
  config,
  configFromSession,
  configFromURL,
  saveConfig,
  SkylinConfig,
} from '@line-ui/line/src/utils/config/config';

// export config
export * from '@line-ui/line/src/utils/config/config';

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

  let Line = {} as any;

  if (hasWindow) {
    Line = (win as any).Line || Line;
  }

  // create the Line.config from raw config object (if it exists)
  // and convert Line.config into a ConfigApi that has a get() fn
  configObj = {
    ...configObj,
    ...(hasWindow && configFromSession(win)),
    persistConfig: false,
    ...Line.config,
    ...(hasWindow && configFromURL(win)),
  };

  config.reset(configObj!);

  if (hasWindow && config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  const getModeFallback = () => {
    let fallback = 'ios';
    if (hasDocument && hasWindow) {
      fallback =
        doc.documentElement.getAttribute('mode') ||
        (isPlatform(win, 'android') ? 'md' : 'ios');
    }
    return fallback;
  };

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by pre-rendering
  // otherwise get the mode via config settings, and fallback to ios
  Line.config = config;
  Line.mode = defaultMode = config.get('mode', getModeFallback());

  config.set('mode', defaultMode);

  if (hasDocument) {
    doc.documentElement.setAttribute('mode', defaultMode);
    doc.documentElement.classList.add(defaultMode);
  }

  if (config.getBoolean('testing')) {
    config.set('animated', false);
  }
}
