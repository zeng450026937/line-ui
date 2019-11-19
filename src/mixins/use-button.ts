import { createMixins } from '@/utils/mixins';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';
import { BEM } from '@/utils/namespace/bem';

export interface ButtonOptions {
  group: string;
  bem: BEM;
  role: string;
  tag?: string;
}

export function useButton(options: ButtonOptions) {
  return createMixins({
    mixins : [useRipple()],

    props : {
      // This property holds a textual description of the button.
      text     : String,
      // This property holds whether the button is disabled.
      disabled : Boolean,
    },
  });
}
