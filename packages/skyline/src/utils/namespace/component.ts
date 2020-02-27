/* eslint-disable import/extensions, max-len */
import {
  CombinedVueInstance,
  Vue,
  VueConstructor,
} from 'vue/types/vue';
import {
  ComponentOptions,
  FunctionalComponentOptions,
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
} from 'vue/types/options';
import {
  ScopedSlot,
  VNode,
} from 'vue/types/vnode';

import { Mods } from 'skyline/utils/namespace/bem';
import { camelize } from 'skyline/utils/string-transform';
import { unifySlots } from 'skyline/utils/vnode';

import { useComponent } from 'skyline/mixins/use-component';
import { useRender } from 'skyline/mixins/use-render';
import { useMode } from 'skyline/mixins/use-mode';

export function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${ name }`), this);
}

export type TsxComponentProps<Props, Slots> = Props & {
  // hack for jsx prop spread
  key: string | number;
  ref: string;
  refInFor: boolean;
  slot: string;
  props: object;
  domProps: object;
  class: object | Mods;
  style: string | object[] | object;
  scopedSlots: { [key: string]: ScopedSlot | undefined } & Slots;
  on: object;
  nativeOn: object;
};

export type TsxComponent<Props, Slots> = (
  props: Partial<TsxComponentProps<Props, Slots>>
) => VNode;

export type LineComponent<
  Slots = any,
  Data = any,
  Methods = any,
  Computed = any,
  Props = any,
> = (
  FunctionalComponentOptions<Props> |
  ComponentOptions<Vue, Data, Methods, Computed, Props>
) &
  {
    name: string;
    install: typeof install;

    new (): CombinedVueInstance<Vue, Data, Methods, Computed, Props>;
  } &
  TsxComponent<Props, Slots>;


export function createComponent<V extends Vue = Vue>(name: string): {
  <Slots, Data, Computed, Methods, PropNames extends string = never>(
    sfc: ThisTypedComponentOptionsWithArrayProps<V, Data, Methods, Computed, PropNames>
  ): LineComponent<Slots, Data, Methods, Computed, Record<PropNames, any>>;

  <Slots, Data, Methods, Computed, Props>(
    sfc: ThisTypedComponentOptionsWithRecordProps<V, Data, Methods, Computed, Props>
  ): LineComponent<Slots, Data, Methods, Computed, Props>;

  <Slots, PropNames extends string = never>(
    sfc: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]>
  ): LineComponent<Slots, {}, {}, {}, Record<PropNames, any>>;

  <Slots, Props>(
    sfc: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>>
  ): LineComponent<Slots, {}, {}, {}, Props>;

  (sfc: ComponentOptions<V >): LineComponent<{}, {}, {}, {}>;
}

export function createComponent(name: string) {
  return function (
    sfc: any,
  ) {
    sfc.name = name;
    sfc.install = install;

    if (sfc.functional) {
      const { render } = sfc;
      sfc.render = (h: any, ctx: any) => render.call(undefined, h, unifySlots(ctx));
    } else {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(
        useComponent(),
        useRender(),
        useMode(),
      );
    }

    return sfc;
  };
}
