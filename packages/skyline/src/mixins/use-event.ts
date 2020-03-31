import { createMixins } from 'skyline/src/utils/mixins';
import { arrayify } from 'skyline/src/utils/helpers';
import {
  getApp,
  on,
} from 'skyline/src/utils/dom';

export interface EventOptions extends AddEventListenerOptions {
  event: string | Array<string>;
  global?: boolean;
}

export interface EventCondition {
  ev: Event;
  name: string;
  prevent: () => void;
}

export function useEvent(options: EventOptions) {
  const {
    event,
    global = false,
  } = options;

  return createMixins({
    mounted() {
      const { $el } = this;
      const target = global ? getApp($el) : $el;

      const offs = arrayify(event).map(name => {
        let dismiss = false;

        const prevent = () => dismiss = true;

        const maybe = (ev: Event) => {
          this.$emit('event-condition', { ev, name, prevent });
          if (!dismiss) return;
          this.$emit('event-handler', ev, name);
        };

        return on(target, name, maybe, options);
      });

      const teardown = () => offs.forEach(off => off());

      this.useEvent = { teardown };
    },

    beforeDestroy() {
      this.useEvent.teardown();
    },
  });
}
