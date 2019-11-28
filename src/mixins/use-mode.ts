import { createMixins } from '@/utils/mixins';
import { config } from '@/utils/config';

export function useMode() {
  return createMixins({
    inject : {
      providedMode : {
        from    : 'mode',
        default : config.get('mode', 'md'),
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
      if (!vnode || !vnode.data) return;
      vnode.data.staticClass = `${ this.mode } ${ vnode.data.staticClass || '' }`.trim();
    },
  });
}
