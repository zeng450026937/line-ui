import { createMixins } from '@/utils/mixins';
import { on, off } from '@/utils/dom/event';
import { isFunction, isArray } from '@/utils/helpers';
/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';

export type RestAny = {[K: string]: any};
export type VueInstance<T = RestAny> = Vue & T;

export type EventHandler<T = RestAny> = (this: VueInstance<T>, ev: Event, options: EventOptions) => void;
export type ConditionHandler<T = RestAny> = (this: VueInstance<T>, ev: Event, options: EventOptions) => boolean;

export interface EventOptions {
  event: string | Array<string>;
  handler: string | EventHandler;
  condition?: string | ConditionHandler;
  passive?: boolean;
  capture?: boolean;
  global?: boolean;
}

export function invoke(vm: any, name: string | Function, ...args: any[]) {
  return isFunction(name) ? name.call(vm, ...args) : vm[name] && vm[name](...args);
}

export function useEvent<T extends EventOptions = EventOptions>(options: T) {
  let app = document.body;
  const { global = false } = options;

  function eventHandler(this: VueInstance, ev: Event) {
    const { condition, handler } = options;
    if (condition && !invoke(this, condition, ev, options)) return;
    invoke(this, handler, ev, options);
  }

  function bind(this: VueInstance) {
    const { useEvent = {} } = this;
    if (useEvent.binded) return;
    app = document.querySelector('[skyline-app]') || app;
    const handler = useEvent.handler = eventHandler.bind(this);
    const { event, passive = false, capture = false } = options;
    const events = isArray(event) ? event : [event];
    events.forEach(event => on(global ? app : this.$el, event, handler, passive, capture));
    useEvent.binded = true;
  }

  function unbind(this: VueInstance) {
    const { useEvent = {} } = this;
    if (!useEvent.binded) return;
    const events = isArray(options.event) ? options.event : [options.event];
    events.forEach(event => off(global ? app : this.$el, event, useEvent.handler));
    useEvent.binded = false;
  }

  return createMixins({
    mounted       : bind,
    activated     : bind,
    deactivated   : unbind,
    beforeDestroy : unbind,
  });
}
