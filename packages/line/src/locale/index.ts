import Vue from 'vue';
import { deepAssign } from '@line-ui/line/src/utils/helpers/deep-assign';
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

defineReactive(proto, '$lineLang', 'zh-CN');
defineReactive(proto, '$lineMessages', {
  'zh-CN' : defaultMessages,
});

export default {
  messages() {
    return proto.$lineMessages[proto.$lineLang];
  },

  use(lang: string, messages?: object) {
    proto.$lineLang = lang;
    this.add({ [lang]: messages });
  },

  add(messages = {}) {
    deepAssign(proto.$lineMessages, messages);
  },
};
