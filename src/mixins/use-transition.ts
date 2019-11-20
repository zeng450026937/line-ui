import { createMixins } from '@/utils/mixins';

const TRANSITION_EVENTS = [
  'before-enter',
  'enter',
  'after-enter',
  'before-leave',
  'enter-cancelled',
  'leave',
  'after-leave',
  'leave-cancelled',
  'before-appear',
  'appear',
  'after-appear',
  'appear-cancelled',
];

export function useTransition(appear: boolean = true) {
  return createMixins({
    props : {
      transition : String,
    },

    afterRender(vnode, ctx) {
      const { transition = this.transition } = ctx;
      if (!transition) return;
      const data = {
        props : {
          name : transition,
          appear,
        },
        on : TRANSITION_EVENTS.reduce((prev, val) => {
          prev[val] = (...args: any[]) => this.$emit('val', ...args);
          return prev;
        }, {} as Record<string, any>),
      };
      /* eslint-disable-next-line */
      return this.$createElement(
        'transition', data, [vnode],
      );
    },
  });
}
