/* eslint-disable import/extensions, max-len */
import { Vue } from 'vue/types/vue';
import { RenderContext } from 'vue/types/options';
import {
  NormalizedScopedSlot,
  ScopedSlotChildren,
  VNodeData,
} from 'vue/types/vnode';

import { mergeData } from '@/utils/vnode/merge-data';
import { hasOwn, isFunction } from '@/utils/helpers';

type UnifyContext = RenderContext | Vue;

export function createSlots<T extends UnifyContext>(context: T, functional = true) {
  const prefix = functional ? '' : '$';
  const attrsKey = `${ prefix }attrs`;
  const slotsKey = `${ prefix }slots`;
  const scopedSlotsKey = `${ prefix }scopedSlots`;

  const $slots = context[slotsKey] as Slots;
  const $scopedSlots = (context[scopedSlotsKey] || context[attrsKey] || {}) as ScopedSlots;

  return {
    hasSlot : (name = 'default'): boolean => {
      return !!$scopedSlots[name] || !!$slots[name];
    },

    slots : (name = 'default', ctx?: any, patch?: VNodeData | PacthFn): ScopedSlotChildren => {
      const scopedSlot = $scopedSlots[name];
      const vnodes = scopedSlot ? scopedSlot(ctx) : $slots[name];

      if (vnodes) {
        const slotclass = {
          slotted            : true,
          [`slot-${ name }`] : name !== 'default',
        };

        vnodes.forEach((vnode, index) => {
          if (!vnode.data) return;

          vnode.data = mergeData(
            vnode.data,
            { class: slotclass },
          );

          if (!patch) return;

          vnode.data = mergeData(
            vnode.data,
            isFunction(patch) ? patch(vnode.data, index) : patch,
          );
        });
      }

      return vnodes;
    },
  };
}

export function unifySlots<T extends RenderContext>(context: T): T {
  const injections = createSlots(context);

  return new Proxy(context, {
    get(target: T, key: string | symbol, receiver: object) {
      if (hasOwn(injections, key)) {
        return injections[key];
      }
      return Reflect.get(target, key, receiver);
    },
  });
}

type Slots = {
  [key: string]: ScopedSlotChildren;
};
type ScopedSlots = {
  [key: string]: NormalizedScopedSlot | undefined ;
};

type PacthFn = (vnode: VNodeData, index: number) => VNodeData;
