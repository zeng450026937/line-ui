import { createMixins } from '@/utils/mixins';
import { createI18N } from '@/utils/namespace/i18n';

import '@/locale';

export function useI18N(name: string) {
  return createMixins({
    methods : {
      t : createI18N(name),
    },
  });
}
