import { createMixins } from '@line-ui/line/src/utils/mixins';
import { createTransitionHooks } from '@line-ui/line/src/utils/transition';

export function useTransition(appear: boolean = true) {
  const props = { appear, css: false };

  return createMixins({
    props: {
      transition: {
        type: Boolean,
        default: undefined,
      },
    },

    afterRender(vnode) {
      if (this.transition === false) return;
      return this.$createElement(
        'transition',
        {
          props,
          on: createTransitionHooks(this),
        },
        [vnode]
      );
    },
  });
}
