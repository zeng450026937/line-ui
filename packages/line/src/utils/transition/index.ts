/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { NOOP } from '@line-ui/line/src/utils/helpers';

export const ENTER_EVENTS = [
  'before-enter',
  'enter',
  'after-enter',
  'enter-cancelled',
];
export const LEAVE_EVENTS = [
  'before-leave',
  'leave',
  'after-leave',
  'leave-cancelled',
];
export const APPEAR_EVENTS = [
  'before-appear',
  'appear',
  'after-appear',
  'appear-cancelled',
];

export function createTransitionHooks(delegate: Vue, appear = false) {
  const events = [
    ...ENTER_EVENTS,
    ...LEAVE_EVENTS,
    ...(appear ? APPEAR_EVENTS : []),
  ];
  return events.reduce((prev, val) => {
    // Vue check hook funcion's argments length with Function.length
    // While ...args will left Function.length to be 0
    // and the hook will not work right
    prev[val] = (el: HTMLElement, done: Function) =>
      delegate.$emit(val, el, done || NOOP);
    return prev;
  }, {} as Record<string, any>);
}
