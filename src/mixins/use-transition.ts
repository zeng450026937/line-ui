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

export interface TransitionOptions {
  appear?: boolean,
  css?: boolean,
}

export function useTransition(options?: TransitionOptions) {
  const { appear = true, css = true } = options || {};
  return createMixins({
    props : {
      transition : String,
    },

    afterRender(vnode, ctx) {
      const { transition = this.transition } = ctx;
      if (css && !transition) return;
      const data = {
        props : {
          name : transition,
          appear,
          css,
        },
        on : TRANSITION_EVENTS.reduce((prev, val) => {
          prev[val] = (...args: any[]) => this.$emit(val, ...args);
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
