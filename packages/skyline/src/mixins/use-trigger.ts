/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { createMixins } from 'skyline/src/utils/mixins';
import {
  isArray,
  isString,
} from 'skyline/src/utils/helpers';

export const isVue = (val: any): val is Vue => val && val._isVue;

export function useTrigger() {
  return createMixins({
    props : {
      // string or Element
      trigger : null as any,
    },

    computed : {
      // TODO
      // Evaluate before mounted may resolve $refs uncorrectly
      $trigger(): Vue | Element | undefined | null {
        const { trigger, $vnode } = this;

        if (!trigger) return;

        const baseEl = (($vnode && $vnode.context!.$el) || document) as HTMLElement;

        if (!$vnode) {
          return isString(trigger)
            ? baseEl.querySelector(trigger)
            : trigger as HTMLElement;
        }

        const refs = $vnode.context!.$refs;
        const resolved = isString(trigger)
          ? refs[trigger] || baseEl.querySelector(trigger)
          : trigger as HTMLElement;

        if (__DEV__ && isArray(resolved)) {
          console.warn(`
            There are more than one triggers in the context.
            Trigger element should be only one.
          `);
        }

        return isArray(resolved)
          ? resolved[0]
          : resolved;
      },
      $triggerEl(): Element | undefined | null {
        const trigger = this.$trigger;
        return isVue(trigger)
          ? trigger.$el
          : trigger;
      },
    },
  });
}
