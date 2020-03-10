import { createMixins } from 'skyline/utils/mixins';
import { createTransitionHooks } from 'skyline/utils/transition';
import { isObject } from 'skyline/utils/helpers';

export interface TransitionOptions {
  appear?: boolean;
  css?: boolean;
  appearHook?: boolean;
}

export function useTransition(options?: TransitionOptions) {
  const {
    appear = true,
    css = true,
    appearHook = false,
  } = options || {};

  return createMixins({
    props : {
      // string | object | false
      transition : null as any,
    },

    beforeMount() {
      this.useTransition = {
        transition : {
          appear,
          css,
        },
      };
    },

    afterRender(vnode) {
      const transition = isObject(this.transition)
        ? {
          appear,
          // css,
          ...this.transition,
        }
        : {
          name   : this.transition,
          appear : !!this.transition || appear,
          css    : !!this.transition || css,
        };
      // allow user to change transition
      // for internally use
      this.$emit('transition', transition);

      if (transition.css && !transition.name) return;

      const { useTransition } = this;

      if (!useTransition.hooks || useTransition.transition.css !== transition.css) {
        useTransition.transition = transition;
        useTransition.hooks = createTransitionHooks(this, appearHook, transition.css);
      }

      const data = {
        props : transition,
        on    : useTransition.hooks,
      };

      /* eslint-disable-next-line */
      return this.$createElement(
        'transition', data, [vnode],
      );
    },
  });
}
