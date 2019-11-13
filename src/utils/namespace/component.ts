/**
 * Create a basic component with common options
 */
import Vue, {
  VueConstructor,
  ComponentOptions,
  RenderContext,
  FunctionalComponentOptions,
  VNode,
} from 'vue';
/* eslint-disable import/extensions */
import {
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
  RecordPropsDefinition,
} from 'vue/types/options';
/* eslint-enable import/extensions */
import '@/locale';
import { camelize } from '@/utils/format/string';
import { usePatch } from '@/mixins/use-patch';
import { useSlots } from '@/mixins/use-slots';
import { useBEM } from '@/mixins/use-bem';
import { useI18N } from '@/mixins/use-i18n';
import { BEM } from './bem';
import { Translate } from './i18n';
import { DefaultSlots, DefaultEvents } from '@/utils/types';

export function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${ name }`), this);
}

// unify slots & scopedSlots
export function unifySlots(context: RenderContext): RenderContext {
  const originalSlots = context.slots;

  context.slots = (name: string = 'default', ctx?: any) => {
    // use data.scopedSlots in lower Vue version
    const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
    const scopedSlot = scopedSlots[name];

    if (scopedSlot) {
      return scopedSlot(ctx);
    }

    const slots = originalSlots();

    return slots[name];
  };

  return context;
}

// should be removed after Vue 3
export function transformFunctionComponent(pure: FunctionalComponentOptions) {
  const { render } = pure;
  pure.render = (h, context): any => render && render.call(undefined, h, unifySlots(context));
}

export type TsxBaseProps<Slots> = {
  // hack for jsx prop spread
  key: string | number;
  ref: string;
  refInFor: boolean;
  slot: string;
  props: object;
  domProps: object;
  class: object;
  style: string | object[] | object;
  scopedSlots: Slots & DefaultSlots;
  on: object;
  nativeOn: object;
};

export type TsxComponent<Props = Record<string, any>, Events = {}, Slots = DefaultSlots> = (
  props: Partial<Props & Events & TsxBaseProps<Slots>> & { [attributes: string]: string | true }
) => VNode;

export type LineComponent<
  Event = any,
  Slots = any,
  Data = any,
  Methods = any,
  Computed = any,
  Props = any,
> = (
  FunctionalComponentOptions<Props> |
  ComponentOptions<never, Data, Methods, Computed, Props>
) &
 { name: string, install: typeof install } &
 TsxComponent<Props, Event, Slots>;

export type InjectedType = {
  slots(name?: string, props?: any): any;
  bem: BEM;
  t: Translate;
  [key: string]: any
}

export type InjectOptions<Events = DefaultEvents, Slots = DefaultSlots> = {
  // use-patch
  shouldRender?(): boolean;
  afterRender?(vnode: VNode, ctx: RenderContext): void;
  // namespace
  install?: (Vue: VueConstructor) => void;
  // extend
  events?: Events;
  slots?: Slots;
}

export function createComponent<V extends Vue = Vue>(name: string): {
  <Events, Slots, Data, Computed, Methods, PropNames extends string = never>(
    sfc: ThisTypedComponentOptionsWithArrayProps<V & InjectedType, Data, Methods, Computed, PropNames> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, Data, Methods, Computed>;

  <Events, Slots, Data, Methods, Computed, Props>(
    sfc: ThisTypedComponentOptionsWithRecordProps<V & InjectedType, Data, Methods, Computed, Props> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, Data, Methods, Computed, Props>;

  <Events, Slots, PropNames extends string = never>(
    sfc: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, any, any, any, Record<PropNames, any>>;

  <Events, Slots, Props>(
    sfc: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, any, any, any, Props>;

  (sfc: ComponentOptions<Vue & {[others: string]: any}>): LineComponent<any, any, any, any>;
}

export function createComponent(name: string) {
  return function (
    sfc: any,
  ) {
    if (sfc.functional) {
      transformFunctionComponent(sfc);
    } else {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(usePatch(), useSlots(name), useBEM(name), useI18N(name));
    }

    sfc.name = name;
    sfc.install = install;

    return sfc;
  };
}
