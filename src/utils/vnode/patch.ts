import { VNode, VNodeData } from 'vue';
import { mergeData } from '@/utils/vnode';

export function patch(vnode: VNode, data?: VNodeData) {
  if (!data || !vnode.data) return vnode;
  vnode.data = mergeData(vnode.data, data);
  return vnode;
}
