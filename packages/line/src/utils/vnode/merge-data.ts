import { VNodeData } from 'vue';
import {
  mergeClass,
  mergeStaticClass,
} from '@line-ui/line/src/utils/vnode/merge-class';
import { mergeListener } from '@line-ui/line/src/utils/vnode/merge-listener';
import { isArray, isObject } from '@line-ui/line/src/utils/helpers';

export function mergeData(exist: VNodeData, value?: VNodeData) {
  if (!value) return exist;
  if (!exist) return value;

  const data = { ...exist };

  // eslint-disable-next-line
  for (const key in value) {
    const old = exist[key as keyof VNodeData];
    const val = value[key as keyof VNodeData];

    switch (key) {
      case 'class':
        data[key as keyof VNodeData] = mergeClass(old, val);
        break;
      case 'staticClass':
        data[key as keyof VNodeData] = mergeStaticClass(old, val);
        break;
      case 'on':
      case 'nativeOn':
        data[key as keyof VNodeData] = mergeListener(old, val);
        break;
      default:
        data[key as keyof VNodeData] = isArray(old)
          ? old.concat(val)
          : isObject(val)
          ? { ...old, ...val }
          : val;
    }
  }
  return data;
}
