import Vue, {
  ComponentOptions,
  FunctionalComponentOptions,
  RenderContext,
  VNode,
  VNodeData,
  VueConstructor,
} from 'vue';
/* eslint-disable import/extensions, max-len */
import {
  RecordPropsDefinition,
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
} from 'vue/types/options';
import {
  ScopedSlot,
  ScopedSlotChildren,
} from 'vue/types/vnode';
import {
  DefaultEvents,
  InjectedKeys,
  InjectOptions,
  ScopedSlots,
} from '@/utils/types';
import '@/locale';
import { camelize } from '@/utils/format/string';
import { patchVNode } from '@/utils/vnode';
import { isFunction } from '@/utils/helpers';
import { useRender } from '@/mixins/use-render';
import { useComponent } from '@/mixins/use-component';
import { useMode } from '@/mixins/use-mode';
import { Mods } from '@/utils/namespace/bem';

type PacthFn = (vnode: VNodeData, index: number) => VNodeData;

export function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${ name }`), this);
}

// unify slots & scopedSlots
// should be removed after Vue 3
export function unifySlots(context: RenderContext): RenderContext {
  // TODO: use proxy instead of object spread
  return {
    ...context,
    hasSlot(name: string = 'default') {
      // use data.scopedSlots in lower Vue version
      const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
      const scopedSlot = scopedSlots[name];
      return !!scopedSlot || context.slots()[name];
    },
    slots(name: string = 'default', ctx?: any, patch?: VNodeData | PacthFn) {
      // use data.scopedSlots in lower Vue version
      const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
      const scopedSlot = scopedSlots[name];
      const vnodes = scopedSlot ? scopedSlot(ctx) : context.slots()[name] as ScopedSlotChildren;
      if (vnodes && patch) {
        vnodes.forEach((vnode, index) => {
          const staticClass = ((vnode.data || {}).staticClass || '')
            .split(' ');
          if (!staticClass.some(klass => /slotted/.test(klass))) {
            staticClass.push('slotted');
            if (name !== 'default') {
              staticClass.push(`slot-${ name }`);
            }
          }
          patchVNode(vnode, { staticClass: staticClass.join(' ').trim() });
          patch && patchVNode(vnode, isFunction(patch) ? patch(vnode.data || {}, index) : patch);
        });
      }
      return vnodes;
    },
  };
}

export function transformFunctionComponent(pure: FunctionalComponentOptions) {
  const { render } = pure;
  pure.render = render && function patchedRender(h, ctx) {
    const renderProxy = undefined;
    const vnode = render.call(renderProxy, h, unifySlots(ctx));
    return vnode;
  };
}

export type TsxBaseProps<Slots> = {
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

type PropsDef<Props, Events, Slots> = Props & Events & TsxBaseProps<Slots>;

export type TsxComponent<Props, Events = DefaultEvents, Slots = ScopedSlots> = (
  props: Partial<PropsDef<Props, Events, Slots>> & { [K: string]: string | true | Function | any }
) => VNode;

export type LineComponent<
  Events = any,
  Slots = any,
  Data = any,
  Methods = any,
  Computed = any,
  Props = any,
> = (
  // typeof Vue |
  FunctionalComponentOptions<Props> |
  ComponentOptions<Vue, Data, Methods, Computed, Props>
) &
 { name: string, install: typeof install } &
 TsxComponent<Props, Events, Slots>;

export function createComponent<V extends Vue = Vue>(name: string): {
  <Events, Slots, Data, Computed, Methods, PropNames extends string = never>(
    sfc: ThisTypedComponentOptionsWithArrayProps<V & InjectedKeys, Data, Methods, Computed, PropNames> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, Data, Methods, Computed, Record<PropNames, any>>;

  <Events, Slots, Data, Methods, Computed, Props>(
    sfc: ThisTypedComponentOptionsWithRecordProps<V & InjectedKeys, Data, Methods, Computed, Props> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, Data, Methods, Computed, Props>;

  <Events, Slots, PropNames extends string = never>(
    sfc: FunctionalComponentOptions<Record<PropNames, any>, PropNames[]> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, {}, {}, {}, Record<PropNames, any>>;

  <Events, Slots, Props>(
    sfc: FunctionalComponentOptions<Props, RecordPropsDefinition<Props>> & InjectOptions<Events, Slots>
  ): LineComponent<Events, Slots, {}, {}, {}, Props>;

  (sfc: ComponentOptions<V & InjectedKeys>): LineComponent<{}, {}, {}, {}>;
}

export function createComponent(name: string) {
  return function (
    sfc: any,
  ) {
    if (sfc.functional) {
      transformFunctionComponent(sfc);
    } else {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(useComponent(name), useRender(), useMode());
    }

    sfc.name = name;
    sfc.install = install;

    return sfc;
  };
}
