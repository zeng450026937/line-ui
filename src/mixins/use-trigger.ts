/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { isArray, isString } from '@/utils/helpers';

export const isVue = (val: any): val is Vue => val && val._isVue;

export function useTrigger() {
  return createMixins({
    props : {
      trigger : [String, Object],
    },

    computed : {
      // TODO
      // Evaluate before mounted may resolve $refs uncorrectly
      $trigger(): Vue | Element | undefined {
        const { trigger, $vnode } = this;

        if (!trigger) return undefined;

        const baseEl = ($vnode.context!.$el || document) as HTMLElement;
        const refs = $vnode.context!.$refs;
        const resolved = isString(trigger)
          ? refs[trigger] || baseEl.querySelector(trigger)
          : trigger as HTMLElement;

        if (isArray(resolved)) {
          console.warn(`
            There are more than one triggers in the context.
            Trigger element should be only one.
          `);
        }

        return isArray(resolved)
          ? resolved[0]
          : resolved;
      },
      $triggerEl(): Element | undefined {
        const trigger = this.$trigger;
        return isVue(trigger)
          ? trigger.$el
          : trigger;
      },
    },
  });
}
