import { createMixins } from 'skyline/utils/mixins';
import { config } from 'skyline/utils/config';
import { isString } from 'skyline/utils/helpers';

export function createModeClasses(mode: string) {
  if (!isString(mode) || !mode) return undefined;
  return {
    [mode] : true,
  };
}

export function useMode() {
  return createMixins({
    inject : {
      providedMode : {
        from    : 'mode',
        default : config.get('mode', 'ios'),
      },
    },

    props : {
      mode : {
        type : String,
        default() {
          return this.providedMode as string;
        },
      },
    },

    provide() {
      return {
        mode : this.mode,
      };
    },

    afterRender(vnode) {
      if (!vnode.data) return;
      vnode.data.staticClass = `${ this.mode } ${ vnode.data.staticClass || '' }`.trim();
    },
  });
}
