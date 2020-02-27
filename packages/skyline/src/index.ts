import { VueConstructor } from 'vue';
import { install, LineOptions } from 'skyline/install';
import * as components from 'skyline/components';
import * as directives from 'skyline/directives';
import * as mixins from 'skyline/mixins';

export * from 'skyline/components';
// export * from 'skyline/directives';
// export * from 'skyline/mixins';


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
    mixins,

    version : __VERSION__,
  };
}

/* eslint-disable-next-line */
export default /*#__PURE__*/ defaulExport();
