import { createMixins } from 'skyline/utils/mixins';
import {
  EventOptions,
  invoke,
  RestAny,
  useEvent,
  VueInstance,
} from 'skyline/mixins/use-event';

export type IncludeHandler<T = RestAny> = (this: VueInstance<T>) => Array<Element>;

export type ClickOutsideOption = Partial<EventOptions & {
  includes?: string | IncludeHandler;
}>;

export function useClickOutside(options: ClickOutsideOption = {}) {
  const {
    global = true,
    event = ['mouseup', 'touchend'],
    handler = function (this: VueInstance) {
      this.$emit('clickoutside');
    },
    condition = function (this: VueInstance, ev: Event) {
      // If click was triggered programmaticaly (domEl.click()) then
      // it shouldn't be treated as click-outside
      // Chrome/Firefox support isTrusted property
      // IE/Edge support pointerType property (empty if not triggered
      // by pointing device)
      if (('isTrusted' in ev && !ev.isTrusted)
       || ('pointerType' in ev && !(ev as PointerEvent).pointerType)
      ) return false;

      const elements = options.includes
        ? invoke(this, options.includes) as Array<Element>
        : [this.$el];

      return !elements.some(element => element.contains(ev.target as Node));
    },
  } = options;

  return createMixins({
    mixins : [
      useEvent<EventOptions>({
        event, handler, condition, global,
      }),
    ],
  });
}
