import Vue from 'vue';
import { createI18N } from '@/utils/namespace/i18n';

export function useI18N(name: string) {
  return Vue.extend({
    methods : {
      t : createI18N(name),
    },
  });
}
