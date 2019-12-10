import Vue from 'vue';
import { deepAssign } from '@/utils/language';
import defaultMessages from './lang/zh-CN';

declare module 'vue' {
  interface VueConstructor {
    util: {
      defineReactive(obj: object, key: string, value: any): void;
    };
  }
}

const proto = Vue.prototype;
const { defineReactive } = Vue.util;

defineReactive(proto, '$skylineLang', 'zh-CN');
defineReactive(proto, '$skylineMessages', {
  'zh-CN' : defaultMessages,
});

export default {
  messages() {
    return proto.$skylineMessages[proto.$skylineLang];
  },

  use(lang: string, messages?: object) {
    proto.$skylineLang = lang;
    this.add({ [lang]: messages });
  },

  add(messages = {}) {
    deepAssign(proto.$skylineMessages, messages);
  },
};
