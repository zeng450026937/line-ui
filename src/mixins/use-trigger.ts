/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { on, off } from '@/utils/dom/event';
import { isArray } from '@/utils/helpers';

export const isVue = (val: any): val is Vue => val && val._isVue;

type EventTarget = Vue | HTMLElement;
type EventHandlers = {
  [K: string]: Function;
};

export function setupEventHandlers(target: EventTarget, handlers: EventHandlers) {
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

export function removeEventHandlers(target: EventTarget, handlers: EventHandlers) {
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

export function useTrigger() {
  return createMixins({
    props : {
      trigger : String,
    },

    computed : {
      $triggerEl(): HTMLElement | null {
        const { trigger, $vnode } = this;

        if (!trigger) return null;

        const baseEl = ($vnode.context!.$el || document) as HTMLElement;
        const refs = $vnode.context!.$refs;
        const target = refs[trigger] || baseEl.querySelector(trigger);

        if (isArray(target)) {
          console.warn('\nThere are more than one triggers in the context.\nTrigger element should be only one.');
          return null;
        }
        return (isVue(target) ? target.$el : target) as HTMLElement;
      },
    },
  });
}
