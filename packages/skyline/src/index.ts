import { VueConstructor } from 'vue';
import {
  install,
  LineOptions,
} from 'skyline/src/install';
import * as components from 'skyline/src/components';
import * as directives from 'skyline/src/directives';
import * as controllers from 'skyline/src/controllers';
import * as mixins from 'skyline/src/mixins';

export * from 'skyline/src/components';
export * from 'skyline/src/directives';
export * from 'skyline/src/controllers';
export * from 'skyline/src/mixins';

export * from 'skyline/src/utils/bem';
export * from 'skyline/src/utils/component';
export * from 'skyline/src/utils/namespace';


export const Skyline = {
  install,
  version : __VERSION__,
};

function defaulExport() {
  // auto install for umd build
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue, {
      components,
      directives,
    });
  }

  return {
    install(Vue: VueConstructor, opts?: LineOptions) {
      install(Vue, {
        components,
        directives,
        ...opts,
      });
    },

    components,
    directives,
    controllers,
    mixins,

    version : __VERSION__,
  };
}

export default /*#__PURE__*/ defaulExport();
