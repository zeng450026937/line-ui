import { createMixins } from 'skyline/src/utils/mixins';
import {
  EventCondition,
  EventOptions,
  useEvent,
} from 'skyline/src/mixins/use-event';

export type ClickOutsideOption = EventOptions;

export function useClickOutside(options?: ClickOutsideOption) {
  const {
    global = true,
    event = ['mouseup', 'touchend'],
  } = options || {};

  return createMixins({
    mixins : [
      useEvent({ global, event }),
    ],

    mounted() {
      this.$on('event-condition', (condition: EventCondition) => {
        const { ev, prevent } = condition;
        // If click was triggered programmaticaly (domEl.click()) then
        // it shouldn't be treated as click-outside
        // Chrome/Firefox support isTrusted property
        // IE/Edge support pointerType property (empty if not triggered
        // by pointing device)
        if (('isTrusted' in ev && !ev.isTrusted)
         || ('pointerType' in ev && !(ev as PointerEvent).pointerType)
        ) return false;

        let elements: Element[] = [this.$el];

        const include = (el: Element | Element[]) => {
          elements = elements.concat(el);
        };

        this.$emit('event-include', include);

        if (elements.some(el => el && el.contains(ev.target as Node))) {
          prevent();
        }
      });

      this.$on('event-handler', () => this.$emit('clickoutside'));
    },
  });
}
