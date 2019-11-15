import { createMixins } from '@/utils/mixins';
import { BEM } from '@/utils/namespace/bem';

export interface ButtonOptions {
  group: string;
  bem: BEM;
  role: string;
}

export function useButton(options: ButtonOptions) {
  return createMixins({
  });
}
