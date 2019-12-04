import { VNode, VNodeData } from 'vue';
import { mergeData } from '@/utils/vnode/merge-data';

export function patchVNode(vnode: VNode, data?: VNodeData) {
  if (!data) return vnode;
  vnode.data = vnode.data ? mergeData(vnode.data, data) : data;
  return vnode;
}
