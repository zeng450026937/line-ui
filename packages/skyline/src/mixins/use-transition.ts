import { createMixins } from 'skyline/src/utils/mixins';
import { createTransitionHooks } from 'skyline/src/utils/transition';

export function useTransition(appear: boolean = true) {
  const props = { appear, css: false };

  return createMixins({
    props : {
      transition : {
        type    : Boolean,
        default : undefined,
      },
    },

    afterRender(vnode) {
      if (this.transition === false) return;
      return this.$createElement(
        'transition',
        {
          props,
          on : createTransitionHooks(this),
        },
        [vnode],
      );
    },
  });
}
