import { createMixins } from '@/utils/mixins';
import { isObject, isDef } from '@/utils/helpers';

const ENTER_EVENTS = [
  'before-enter',
  'enter',
  'after-enter',
  'enter-cancelled',
];
const LEAVE_EVENTS = [
  'before-leave',
  'leave',
  'after-leave',
  'leave-cancelled',
];
const APPEAR_EVENTS = [
  'before-appear',
  'appear',
  'after-appear',
  'appear-cancelled',
];

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
  const events = [
    ...ENTER_EVENTS,
    ...LEAVE_EVENTS,
    ...(appearHook ? APPEAR_EVENTS : []),
  ];

  return createMixins({
    props : {
      // string | object | false
      transition : null as any,
    },

    created() {
      this.hooks = events.reduce((prev, val) => {
        // Vue check hook funcion's argments length with Function.length
        // While ...args will left Function.length to be 0
        // and the hook will not work right
        prev[val] = (el: HTMLElement, done: Function) => this.$emit(val, el, done);
        return prev;
      }, {} as Record<string, any>);
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

      const data = {
        props : transition,
        on    : this.hooks,
      };
      /* eslint-disable-next-line */
      return this.$createElement(
        'transition', data, [vnode],
      );
    },
  });
}
