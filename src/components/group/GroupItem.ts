import Vue, { VueConstructor } from 'vue';
import { isEmpty } from '@/utils/helpers';

const NullGroup = {
  registerItem() {},
  unregisterItem() {},
};

export type GroupItem<T extends string, C extends VueConstructor | null = null> =
  VueConstructor<Vue &
  {
    checkable: boolean
    checked: boolean
    toggle (): void
  }>;

export function createGroupItem<T extends string, C extends VueConstructor | null = null>(
  name: string, prop: string = 'modelValue', event: string = 'change',
): GroupItem<T, C> {
  function isGroupAvailable(item: Vue) {
    const group = (item as any)[name];
    return group && item.$parent === group;
  }

  return Vue.extend({
    inject: {
      [name]: {
        default: NullGroup,
      },
    },

    model: { prop, event },

    props: {
      [prop]: {
        type: Boolean,
        default: false,
      },
      checkable: {
        type: Boolean,
        default: true,
      },
      value: {
        default: null,
      },
    },

    data() {
      return {
        checked: this[prop],
      };
    },

    watch: {
      [prop](val) {
        this.checked = val;
      },
      checked(val) {
        event && this.$emit(event, val);
      },
    },

    methods: {
      toggle() {
        if (this.checkable) {
          this.checked = !this.checked;
        }
      },
    },

    created() {
      const group = (this as any)[name];
      if (isGroupAvailable(this)) {
        group.registerItem(this, this.$parent);
      }
    },

    beforeDestroy() {
      const group = (this as any)[name];
      if (isGroupAvailable(this)) {
        group.unregisterItem(this, this.$parent);
      }
    },
  });
}
