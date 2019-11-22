import { createMixins } from '@/utils/mixins';
import { isObject } from '@/utils/helpers';

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
  // fallback transition name
  name?: string,
  appear?: boolean,
  css?: boolean,
}

export function useTransition(options?: TransitionOptions) {
  const { name, appear = true, css = true } = options || {};
  return createMixins({
    props : {
      transition : [String, Object],
    },

    afterRender(vnode) {
      const transition = isObject(this.transition)
        ? this.transition
        : {
          name : this.transition || name,
          appear,
          css,
        };
      // allow user to change transition
      // for internally use
      this.$emit('transition', transition);

      if (transition.css && !transition.name) return;

      const data = {
        props : transition,
        on    : TRANSITION_EVENTS.reduce((prev, val) => {
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
