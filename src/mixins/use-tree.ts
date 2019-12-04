import { createMixins } from '@/utils/mixins';
import { useGroupItem } from '@/mixins/use-group-item';
import { useGroup } from '@/mixins/use-group';

export function useTree(name: string = 'Tree') {
  return createMixins({
    mixins : [
      useGroup(name),
      useGroupItem(name),
    ],
  });
}
