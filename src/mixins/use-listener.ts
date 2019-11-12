import Vue from 'vue';
import { mergeListener } from '@/utils/vnode/merge-listener';

export function useListener(name?: string) {
  const listeners = {};

  return Vue.extend({
    methods : {
      listen(name: string, handler?: Function) {
        return this;
      },
    },
  });
}
