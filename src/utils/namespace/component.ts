/**
 * Create a basic component with common options
 */
import '../../locale';
import Vue, {
  VNode, VueConstructor, ComponentOptions, RenderContext,
} from 'vue';
import { camelize } from '../format/string';
import { usePatch } from '@/mixins/use-patch';
import { useSlots } from '@/mixins/use-slots';
import { useBEM } from '@/mixins/use-bem';
import { useI18N } from '@/mixins/use-i18n';
import { DefaultProps, FunctionComponent } from '../types';

export interface LineComponentOptions extends ComponentOptions<Vue> {
  functional?: boolean;
  install?: (Vue: VueConstructor) => void;
}

export type TsxBaseProps<Slots> = {
  key: string | number;
  // hack for jsx prop spread
  props: any;
  class: any;
  style: string | object[] | object;
  scopedSlots: Slots;
};

export type TsxComponent<Props, Events, Slots> = (
  props: Partial<Props & Events & TsxBaseProps<Slots>>
) => VNode;

function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${ name }`), this);
}

// unify slots & scopedSlots
export function unifySlots(context: RenderContext) {
  // use data.scopedSlots in lower Vue version
  const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
  const slots = context.slots();

  Object.keys(slots).forEach((key) => {
    if (!scopedSlots[key]) {
      scopedSlots[key] = () => slots[key];
    }
  });

  return scopedSlots;
}

// should be removed after Vue 3
function transformFunctionComponent(pure: FunctionComponent): LineComponentOptions {
  return {
    functional : true,
    props      : pure.props,
    model      : pure.model,
    render     : (h, context): any => pure(h, context.props, unifySlots(context), context),
  };
}

export type LineComponent = LineComponentOptions | FunctionComponent;

export function createComponent(name: string) {
  return function<Props = DefaultProps, Events = {}, Slots = {}> (
    sfc: LineComponent,
  ): LineComponent extends FunctionComponent ? TsxComponent<Props, Events, Slots> : LineComponentOptions {
    if (typeof sfc === 'function') {
      sfc = transformFunctionComponent(sfc);
    }

    if (!sfc.functional) {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(usePatch(), useSlots(name), useBEM(name), useI18N(name));
    }

    sfc.name = name;
    sfc.install = install;

    return sfc;
  };
}
