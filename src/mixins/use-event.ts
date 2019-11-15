import { createMixins } from '@/utils/mixins';
import { on, off } from '@/utils/dom/event';
import { isFunction, isArray } from '@/utils/helpers';
/* eslint-disable-next-line */
import { Vue } from 'vue/types/vue';
import { DomEventHandler } from '@/utils/types';

export type RestAny = {[K: string]: any};
export type VueInstance<T = RestAny> = Vue & T;

export type EventHandler<T = RestAny> = (this: VueInstance<T>, ev: Event, options: EventOptions) => void;
export type ConditionHandler<T = RestAny> = (this: VueInstance<T>, ev: Event, options: EventOptions) => boolean;

export interface EventOptions {
  event: string | Array<string>;
  handler: string | EventHandler;
  condition?: string | ConditionHandler;
}

export function invoke<T>(vm: any, name: string | Function, ev?: Event, options?: T) {
  return isFunction(name) ? name.call(vm, ev, options) : vm[name](ev, options);
}

export function useEvent<T extends EventOptions = EventOptions>(options: T) {
  let binded = false;
  let app = document.body;
  let handler: DomEventHandler;

  function eventHandler(this: VueInstance, ev: Event) {
    const { condition, handler } = options;
    if (condition && !invoke<T>(this, condition, ev, options)) return;
    invoke<T>(this, handler, ev, options);
  }

  function bind(this: VueInstance) {
    if (binded) return;
    app = document.querySelector('[skyline-app]') || document.body;
    handler = eventHandler.bind(this);
    const events = isArray(options.event) ? options.event : [options.event];
    // should we use capture event listener?
    events.forEach(event => on(app, event, handler, true));
    binded = true;
  }

  function unbind(this: VueInstance) {
    if (!binded) return;
    const events = isArray(options.event) ? options.event : [options.event];
    events.forEach(event => off(app, event, handler));
    binded = false;
  }

  return createMixins({
    mounted       : bind,
    activated     : bind,
    deactivated   : unbind,
    beforeDestroy : unbind,
  });
}
