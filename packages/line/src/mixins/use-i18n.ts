import { createMixins } from '@line-ui/line/src/utils/mixins';

export function useI18n() {
  return createMixins({
    created() {
      this.tr = (str: string) => str;
    },
  });
}
