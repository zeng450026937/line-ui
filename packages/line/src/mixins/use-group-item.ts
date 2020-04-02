import { createMixins } from '@line-ui/line/src/utils/mixins';
import { Group } from '@line-ui/line/src/mixins/use-group';

export function useGroupItem(name: string) {
  return createMixins({
    inject : {
      [name] : {
        default : undefined,
      },
    },

    beforeMount() {
      this.itemIndex = 0;
      this.itemInGroup = false;

      const group = this[name] as Group;
      if (group) {
        // Notice:
        // item index start from 1 not 0
        this.itemIndex = group.registerItem(this);
        this.itemInGroup = true;
      }
    },

    beforeDestroy() {
      const group = this[name];
      if (group) {
        group.unregisterItem(this);
      }
      this.itemIndex = 0;
      this.itemInGroup = false;
    },
  });
}
