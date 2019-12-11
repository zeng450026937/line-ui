/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { off, on } from '@/utils/dom/event';

export const isVue = (val: any): val is Vue => val && val._isVue;

type EventTarget = Vue | Element;
type EventHandlers = {
  [K: string]: Function;
};

export function setupEventHandlers(target?: EventTarget, handlers?: EventHandlers) {
  if (!target || !handlers) return;
  for (const event in handlers) {
    /* eslint-disable-next-line */
    if (handlers.hasOwnProperty(event)) {
      const handler = handlers[event];
      if (isVue(target)) {
        target.$on(event, handler);
      } else {
        on(target, event, handler as any);
      }
    }
  }
}
export function removeEventHandlers(target?: EventTarget, handlers?: EventHandlers) {
  if (!target || !handlers) return;
  for (const event in handlers) {
    /* eslint-disable-next-line */
    if (handlers.hasOwnProperty(event)) {
      const handler = handlers[event];
      if (isVue(target)) {
        target.$off(event, handler);
      } else {
        off(target, event, handler as any);
      }
    }
  }
}
