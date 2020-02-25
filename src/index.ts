import { VueConstructor } from 'vue';
import { install, LineOptions } from '@/install';
import * as components from '@/components';
import * as directives from '@/directives';
import * as mixins from '@/mixins';

// auto install for umd build
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue, {
    components,
    directives,
  });
}

export default {
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
