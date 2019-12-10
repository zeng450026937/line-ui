/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { createMixins } from '@/utils/mixins';
import { setupEventHandlers, removeEventHandlers } from '@/utils/event-handler';
import { isArray, isString } from '@/utils/helpers';

export const isVue = (val: any): val is Vue => val && val._isVue;

export function getElement(target?: Vue | Element) {
  return (isVue(target) ? target.$el : target) as HTMLElement | undefined;
}

export function resolveTarget(vm: Vue, trigger?: string) {
  const { $vnode } = vm;

  if (!trigger) return undefined;

  const baseEl = ($vnode.context!.$el || document) as HTMLElement;
  const refs = $vnode.context!.$refs;
  const resolved = isString(trigger)
    ? refs[trigger] || baseEl.querySelector(trigger)
    : trigger as HTMLElement;

  if (isArray(resolved)) {
    console.warn('\nThere are more than one triggers in the context.\nTrigger element should be only one.');
  }

  return isArray(resolved) ? resolved[0] : resolved;
}

type Trigger = {
  source?: string;
  when: string;
  property?: string;
  value?: string;
  native?: boolean;
};
type TriggerWhen = (string | Trigger)[];

export function normalizeTrigger(triggers: TriggerWhen): Trigger[] {
  triggers = isArray(triggers) ? triggers : [triggers];
  return triggers.map((trigger) => {
    return isString(trigger)
      ? { when: trigger, native: true } as Trigger
      : trigger;
  });
}

export function setupTrigger(vm: Vue, when: TriggerWhen) {
  const triggers = normalizeTrigger(when);
}

export function useTrigger(property: string) {
  return createMixins({
    props : {
      trigger     : [String, Object],
      triggerWhen : [String, Object, Array],
    },

    computed : {
      // TODO
      // Evaluate before mounted may resolve $refs uncorrectly
      $trigger(): Vue | Element | undefined {
        return resolveTarget(this, this.trigger);
      },
      $triggerEl(): HTMLElement | undefined {
        return getElement(this.$trigger);
      },
    },

    watch : {
      trigger     : 'setupTrigger',
      triggerWhen : 'setupTrigger',
    },

    methods : {
      setupTrigger() {
        if (this.useTrigger) {
          this.useTrigger.teardown();
        }

        const trigger = this.$triggerEl;
        let listener: any;

        if (this.triggerWhen === 'hover') {
          listener = {
            mouseenter : () => this[property] = true,
            mouseleave : () => this[property] = false,
          };
        } else if (this.triggerWhen === 'focus') {
          listener = {
            focusin  : () => this[property] = true,
            focusout : () => this[property] = false,
          };
        } else if (this.triggerWhen === 'click') {
          listener = {
            click : () => this[property] = !this[property],
          };
        }

        setupEventHandlers(trigger, listener);

        this.useTrigger = {
          teardown : () => removeEventHandlers(trigger, listener),
        };
      },
    },

    async mounted() {
      await this.$nextTick();
      this.setupTrigger();
    },

    beforeDestroy() {
      if (this.useTrigger) {
        this.useTrigger.teardown();
      }
    },
  });
}
