import Vue, {
  VueConstructor,
  ComponentOptions,
  RenderContext,
  FunctionalComponentOptions,
  VNode,
} from 'vue';
/* eslint-disable import/extensions, max-len */
import {
  ThisTypedComponentOptionsWithArrayProps,
  ThisTypedComponentOptionsWithRecordProps,
  RecordPropsDefinition,
} from 'vue/types/options';
import {
  ScopedSlot,
} from 'vue/types/vnode';
import {
  ScopedSlots,
  DefaultEvents,
  InjectedKeys,
  InjectOptions,
} from '@/utils/types';
import '@/locale';
import { camelize } from '@/utils/format/string';
import {
  useRender,
  shallowCompare,
  BeforeRenderHook,
  AfterRenderHook,
} from '@/mixins/use-render';
import { useComponent } from '@/mixins/use-component';
import { Mods } from '@/utils/namespace/bem';

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
    slots(name: string = 'default', ctx?: any) {
      // use data.scopedSlots in lower Vue version
      const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
      const scopedSlot = scopedSlots[name];
      if (scopedSlot) {
        return scopedSlot(ctx);
      }
      const slots = context.slots();
      return slots[name];
    },
  };
}

export function transformFunctionComponent(pure: FunctionalComponentOptions) {
  const {
    shouldRender,
    beforeRender,
    render,
    afterRender,
  } = pure;
  let prevProps: Record<string, any>;
  let prevVNode: VNode | VNode[];
  pure.render = render && function patchedRender(h, ctx) {
    // if (prevProps && !shallowCompare(prevProps, ctx.props)) return prevVNode;
    const renderProxy = undefined;
    if (shouldRender && !shouldRender.call(renderProxy, prevProps, ctx)) {
      return prevVNode;
    }
    if (beforeRender) {
      (beforeRender as unknown as Array<BeforeRenderHook>).forEach((fn) => fn.call(renderProxy, ctx));
    }
    ctx.prevProps = prevProps;
    ctx.prevVNode = prevVNode;
    let vnode = render.call(renderProxy, h, unifySlots(ctx));
    if (afterRender) {
      (afterRender as unknown as Array<AfterRenderHook>)
        .forEach((fn) => {
          vnode = fn.call(renderProxy, vnode as VNode, ctx) || vnode;
        });
    }
    prevProps = ctx.props;
    prevVNode = vnode;
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
  typeof Vue |
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
      sfc.mixins.push(useComponent(name), useRender());
    }

    sfc.name = name;
    sfc.install = install;

    return sfc;
  };
}
