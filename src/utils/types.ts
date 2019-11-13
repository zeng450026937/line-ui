import { VNode, CreateElement, RenderContext } from 'vue';
import { InjectOptions, PropsDefinition } from 'vue/types/options';

export type EventHandler = (event: Event) => void;

export type ObjectIndex = Record<string, any>;

export type ScopedSlot<Props = any> = (props?: Props) => VNode[] | VNode | undefined;

export type DefaultSlots = {
  default?: ScopedSlot;
};

export type ScopedSlots = DefaultSlots & {
  [key: string]: ScopedSlot | undefined;
};

export type ModelOptions = {
  prop?: string;
  event?: string;
};

export type DefaultData<V> = object | ((this: V) => object);
export type DefaultProps = ObjectIndex;
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
