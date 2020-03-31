import { createMixins } from 'skyline/src/utils/mixins';
import {
  EventOptions,
  useEvent,
} from 'skyline/src/mixins/use-event';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export type PopstateCloseOptions = EventOptions;

export function usePopstateClose(options?: PopstateCloseOptions) {
  const {
    event = 'popstate',
    global = true,
  } = options || {};

  return createMixins({
    mixins : [
      useEvent({ global, event }),
    ],

    mounted() {
      this.$on('event-handler', (ev: Event) => {
        this.$emit('popstate', ev);
        this.close();
      });
    },
  });
}
