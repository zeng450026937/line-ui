import { createMixins } from '@/utils/mixins';

export function useColor() {
  return createMixins({
    props : {
      color : String,
    },
  });
}
