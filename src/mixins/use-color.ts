import { createMixins } from '@/utils/mixins';

export function useColor() {
  return createMixins({
    props : {
      /**
       * The color to use from your application's color palette.
       * Default options are:
       * `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`,
       * `"light"`, `"medium"`, and `"dark"`.
      */
      color : String,
    },
  });
}
