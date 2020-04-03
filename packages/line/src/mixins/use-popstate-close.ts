import { createMixins } from '@line-ui/line/src/utils/mixins';
import { EventOptions, useEvent } from '@line-ui/line/src/mixins/use-event';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export type PopstateCloseOptions = EventOptions;

export function usePopstateClose(options?: PopstateCloseOptions) {
  const { event = 'popstate', global = true } = options || {};

  return createMixins({
    mixins: [useEvent({ global, event })],

    mounted() {
      this.$on('event-handler', (ev: Event) => {
        this.$emit('popstate', ev);
        this.close();
      });
    },
  });
}
