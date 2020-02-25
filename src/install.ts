import { VueConstructor } from 'vue';
import { hyphenate } from '@/utils/string-transform';
import { keys } from '@/utils/helpers';

export interface LineOptions {
  components?: { [key: string]: any };
  directives?: { [key: string]: any };
}

export function install(Vue: VueConstructor, opts: LineOptions = {}) {
  const {
    components,
    directives,
  } = opts;

  if (components) {
    keys(components).forEach(key => {
      Vue.use(components[key]);
    });
  }
  if (directives) {
    keys(directives).forEach(key => {
      Vue.directive(hyphenate(key as string), directives[key]);
      Vue.directive(key as string, directives[key]);
    });
  }
}
