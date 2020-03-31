import { createMixins } from 'skyline/src/utils/mixins';

export function useI18n() {
  return createMixins({
    created() {
      this.tr = (str: string) => str;
    },
  });
}
