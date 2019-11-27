import { createMixins } from '@/utils/mixins';
import {
  RestAny,
  VueInstance,
  EventOptions,
  invoke,
  useEvent,
} from '@/mixins/use-event';

export type IncludeHandler<T = RestAny> = (this: VueInstance<T>) => Array<Element>;

export interface ClickOutsideOptions extends EventOptions {
  includes?: string | IncludeHandler;
}

export function useClickOutside(options?: ClickOutsideOptions) {
  const {
    event = ['mouseup', 'touchend'],
    handler = function (this: VueInstance) {
      this.$emit('clickoutside');
    },
    condition = function (this: VueInstance, ev: Event, options: ClickOutsideOptions) {
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
  } = options || {};

  return createMixins({
    mixins : [
      useEvent<ClickOutsideOptions>({ event, handler, condition }),
    ],
  });
}
