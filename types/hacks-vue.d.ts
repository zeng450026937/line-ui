import Vue, {
  VNode,
  VNodeData,
} from 'vue';

type PacthFn = (vnode: VNodeData, index: number) => VNodeData;

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // use-patch
    shouldRender?: () => boolean;
    beforeRender?: () => void;
    afterRender?: (vnode: VNode) => VNode | void;
  }

  interface RenderContext {
    [injectedKey: string]: any;

    hasSlot(name?: string): boolean;
    slots(name?: string, props?: any, patch?: VNodeData | PacthFn): any;
  }

  interface FunctionalComponentOptions {
    directives?: { [key: string]: DirectiveFunction | DirectiveOptions };
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    [injectedKey: string]: any;

    hasSlot(name?: string): boolean;
    slots(name?: string, props?: any, patch?: VNodeData | PacthFn): any;
  }
}
