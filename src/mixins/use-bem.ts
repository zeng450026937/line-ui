import { createMixins } from '@/utils/mixins';
import { createBEM } from '@/utils/namespace/bem';

export function useBEM(name: string) {
  return createMixins({
    methods : {
      bem : createBEM(name),
    },
  });
}
