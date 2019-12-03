/* eslint-disable import/extensions */
import {
  VNode,
  CreateElement,
  RenderContext,
  VueConstructor,
} from 'vue';
import { InjectOptions, PropsDefinition } from 'vue/types/options';
import { BEM } from '@/utils/namespace/bem';
import { Translate } from '@/utils/namespace/i18n';

export type EventHandler<T extends Event = Event> = (event: T) => void;
export type DomEventHandler<T extends Event = Event> = (event: T) => void;

export type DefaultEvents = {
  [key: string]: (...args: any[]) => void;
};

export type ScopedSlot<Props = any> = (props?: Props) => VNode[] | VNode | undefined;

export type DefaultSlots = {
  default?: ScopedSlot;
};

export type ScopedSlots = DefaultSlots & {
  [key: string]: ScopedSlot;
};

export type ModelOptions = {
  prop?: string;
  event?: string;
};

export type DefaultData<V> = object | ((this: V) => object);
export type DefaultProps = Record<string, any>;
export type DefaultMethods<V> = { [key: string]: (this: V, ...args: any[]) => any };
export type DefaultComputed = { [key: string]: any };
export { PropsDefinition };

export type FunctionComponent<Props = DefaultProps, PropDefs = PropsDefinition<Props>> = {
  (h: CreateElement, props: Props, slots: ScopedSlots, context: RenderContext<Props>):
    | VNode
    | undefined;
  props?: PropDefs;
  model?: ModelOptions;
  inject?: InjectOptions;
};

// Injected Vue
export type InjectedKeys = {
  slots: (name?: string, props?: any) => VNode[] | undefined;
  bem: BEM;
  t: Translate;
  [key: string]: any
}

export interface InjectOptions<Events = DefaultEvents, Slots = ScopedSlots> {
  optimize?: boolean;
  // use-patch
  shouldRender?: (ctx?: RenderContext) => boolean;
  beforeRender?: (ctx: RenderContext) => void;
  afterRender?: (vnode: VNode, ctx: RenderContext) => VNode | void | null | undefined;
  // namespace
  install?: (Vue: VueConstructor) => void;
  // extend
  events?: Events;
  slots?: Slots;
}
