import { createMixins } from '@line-ui/line/src/utils/mixins';
import { useGroup } from '@line-ui/line/src/mixins/use-group';
import { useGroupItem } from '@line-ui/line/src/mixins/use-group-item';
import { isDef } from '@line-ui/line/src/utils/helpers';

export const enum CheckState {
  // The checkbox is unchecked.
  Unchecked = -1,
  // The checkbox is partially checked. This state is only used when tristate is enabled.
  PartiallyChecked = 0,
  // The checkbox is checked.
  Checked = 1,
}

export function useTreeItem(name: string) {
  return createMixins({
    mixins: [useGroup(name), useGroupItem(name)],

    data() {
      return {
        checked: false,
      };
    },

    computed: {
      tristate() {
        return !!this.items.length;
      },

      checkState: {
        get() {
          if (!this.tristate) {
            return this.checked ? CheckState.Checked : CheckState.Unchecked;
          }

          let hasUnchecked = false;
          let hasPartiallyChecked = false;
          let hasChecked = false;

          for (const item of this.items) {
            hasUnchecked =
              hasUnchecked || item.checkState === CheckState.Unchecked;
            hasPartiallyChecked =
              hasPartiallyChecked ||
              item.checkState === CheckState.PartiallyChecked;
            hasChecked = hasChecked || item.checkState === CheckState.Checked;

            if (hasPartiallyChecked) return CheckState.PartiallyChecked;
            if (hasUnchecked && hasChecked) return CheckState.PartiallyChecked;
          }
          // all unchecked
          if (hasUnchecked) return CheckState.Unchecked;
          // all checked
          if (hasChecked) return CheckState.Checked;

          if (__DEV__) {
            console.warn('Internal error, unreachable condition.');
          }

          return CheckState.Unchecked;
        },
        set(val) {
          if (!this.tristate) {
            this.checked = val === CheckState.Checked;
            return;
          }
          if (val === CheckState.PartiallyChecked) {
            __DEV__ && console.error('Unexpect value');
            return;
          }
          this.items.forEach((item: any) => (item.checkState = val));
        },
      },
    },

    watch: {
      checkState(val) {
        if (!this.tristate) return;
        this.checked = val === CheckState.Checked;
      },

      checked(val) {
        if (!this.tristate) return;
        this.checkState = val ? CheckState.Checked : CheckState.Unchecked;
      },
    },

    methods: {
      toggle() {
        const nextCheckState =
          this.checkState === CheckState.Checked
            ? CheckState.Unchecked
            : CheckState.Checked;

        this.checkState = nextCheckState;
      },
    },

    beforeMount() {
      let deep = 0;
      let group = this[name];
      while (group) {
        deep++;
        group = group[name];
      }
      this.itemDeep = deep;

      this.checked =
        this.checked ||
        (isDef(this.$attrs.checked) &&
          (this.$attrs.checked as string | boolean) !== false);
    },
  });
}
