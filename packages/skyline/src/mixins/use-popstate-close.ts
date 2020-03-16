import { createMixins } from 'skyline/src/utils/mixins';
import {
  EventOptions,
  useEvent,
} from 'skyline/src/mixins/use-event';

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface PopstateCloseOptions extends EventOptions {
}

export function usePopstateClose(options?: PopstateCloseOptions) {
  const {
    event = 'popstate',
    handler = 'close',
    global = true,
  } = options || {};
  return createMixins({
    mixins : [
      useEvent<PopstateCloseOptions>({ event, handler, global }),
    ],
  });
}
