import { createMixins } from 'skyline/src/utils/mixins';
import { mergeStaticClass } from 'skyline/src/utils/vnode';

export function createModeClasses(mode?: string) {
  if (!mode) return undefined;
  return {
    [mode] : true,
  };
}

// root component provide 'mode' as default 'mode' for all components
export function useMode(fallback: 'md' | 'ios' = 'ios') {
  return createMixins({
    inject : {
      providedMode : {
        from    : 'mode',
        default : fallback,
      },
    },

    props : {
      mode : {
        type : String,
        default(): string {
          return this.providedMode as string;
        },
      },
    },

    afterRender(vnode) {
      if (!vnode.data) return;
      vnode.data.staticClass = mergeStaticClass(vnode.data.staticClass, this.mode);
    },
  });
}
