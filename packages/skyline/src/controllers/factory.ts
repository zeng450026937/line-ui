import Vue from 'vue';
import {
  popupContext,
  PopupInterface,
} from 'skyline/src/utils/popup';
import { getApp } from 'skyline/src/utils/dom';

export function createFactory(sfc: any) {
  const Component = Vue.extend(sfc);

  const create = (props: any, destroyWhenClose = true) => {
    return new Component({
      propsData : props,
      mounted() {
        (this as any).destroyWhenClose = destroyWhenClose;
        const { $el } = this;
        getApp($el).appendChild($el);
      },
      beforeDestroy() {
        this.$el.remove();
      },
    }).$mount();
  };

  return {
    create,
  };
}

export function createController(sfc: any) {
  const factory = createFactory(sfc);

  const create = (props?: any, destroyWhenClose?: boolean): PopupInterface => {
    return factory.create(props, destroyWhenClose) as any;
  };

  const getTop = () => {
    return popupContext.findPopup(p => {
      if (!sfc.name) return true;
      return p.$options.name === sfc.name;
    });
  };

  const close = (reason?: string) => {
    const lastPopup = getTop();
    lastPopup && lastPopup.close(reason);
  };

  return {
    create,
    close,
    getTop,
  };
}
