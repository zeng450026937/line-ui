import { createMixins } from '@/utils/mixins';
import {
  EventOptions,
  useEvent,
} from '@/mixins/use-event';

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
