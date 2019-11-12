import Vue from 'vue';
import { createBEM } from '@/utils/namespace/bem';

export function useBEM(name: string) {
  return Vue.extend({
    methods : {
      bem : createBEM(name),
    },
  });
}
