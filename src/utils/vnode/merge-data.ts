import { VNodeData } from 'vue';
import { mergeListener } from '@/utils/vnode/merge-listener';
import { isArray, isObject } from '@/utils/helpers';

export function mergeData(exist: VNodeData, value?: VNodeData) {
  if (!value) return exist;
  const data = { ...exist };
  // eslint-disable-next-line
  for (const key in value) {
    const old = exist[key as keyof VNodeData];
    const val = value[key as keyof VNodeData];
    const isListener = key === 'on' || key === 'nativeOn';
    data[key as keyof VNodeData] = old
      ? isListener
        ? mergeListener(old, val)
        : isArray(val)
          ? ([] as Array<object>).concat(old, val)
          : isObject(val)
            ? { ...old, ...val }
            : val
      : val;
  }
  return data;
}
