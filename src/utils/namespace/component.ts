/**
 * Create a basic component with common options
 */
import Vue, {
  VueConstructor,
  ComponentOptions,
  RenderContext,
  FunctionalComponentOptions,
} from 'vue';
import {
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
  RecordPropsDefinition,
} from 'vue/types/options';
import '@/locale';
import { camelize } from '@/utils/format/string';
import { usePatch } from '@/mixins/use-patch';
import { useSlots } from '@/mixins/use-slots';
import { useBEM } from '@/mixins/use-bem';
import { useI18N } from '@/mixins/use-i18n';
import { BEM } from './bem';
import { Translate } from './i18n';

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

export type LineComponent<
  Data = any,
  Methods = any,
  Computed = any,
  Props = any,
> = FunctionalComponentOptions<Props> | ComponentOptions<never, Data, Methods, Computed, Props>;

export type Slots = {
  (name?: string, ctx?: any): any;
}

export type InjectedType = {
  slots: Slots;
  bem: BEM;
  t: Translate;
  [key: string]: any
}

export function createComponent<V extends Vue = Vue>(name: string): {
  <Data, Computed, Methods, PropNames extends string = never>(
    sfc: ThisTypedComponentOptionsWithArrayProps<V & InjectedType, Data, Methods, Computed, PropNames>
  ): LineComponent<Data, Methods, Computed>;

  <Data, Methods, Computed, Props>(
    sfc: ThisTypedComponentOptionsWithRecordProps<V & InjectedType, Data, Methods, Computed, Props>
  ): LineComponent<Data, Methods, Computed, Props>;

  <PropNames extends string = never>(
    sfc: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>
  ): LineComponent<any, any, any, Record<PropNames, any>>;

  <Props>(
    sfc: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>
  ): LineComponent<any, any, any, Props>;

  (sfc: ComponentOptions<Vue & {[others: string]: any}>): LineComponent<any, any, any, any>;
}

export function createComponent(name: string) {
  return function (
    sfc: any,
  ): LineComponent {
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
