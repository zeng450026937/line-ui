import { VueConstructor } from 'vue';
import {
  install,
  LineOptions,
} from '@line-ui/line/src/install';
import * as components from '@line-ui/line/src/components';
import * as directives from '@line-ui/line/src/directives';
import * as controllers from '@line-ui/line/src/controllers';
import * as mixins from '@line-ui/line/src/mixins';

export * from '@line-ui/line/src/components';
export * from '@line-ui/line/src/directives';
export * from '@line-ui/line/src/controllers';
export * from '@line-ui/line/src/mixins';

export * from '@line-ui/line/src/utils/bem';
export * from '@line-ui/line/src/utils/component';
export * from '@line-ui/line/src/utils/namespace';


export const Line = {
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
