<template>
  <div class="select-option"
       :class="{'select-option--active': checked}"
       @click="toggle">
    <slot name="default"
          :label="label"
          :value="value">
      {{ label }}
    </slot>
  </div>
</template>

<script>
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'Select';

export default {
  name : 'SelectOption',

  mixins : [useGroupItem(NAMESPACE)],

  props : {
    value : {
      type     : [String, Boolean, Number],
      default  : null,
      required : true,
    },
    label : {
      type    : [String, Boolean, Number],
      default : null,
    },
  },

  data() {
    return {

    };
  },

  computed : {

  },

  methods : {
    toggle() {
      if (!this.checked) {
        this.checked = true;
      }

      // this.parent.setVisible(false);
    },
  },

  watch : {

  },
};
</script>

<style lang="scss">
.select-option {
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #1a1a1a;
  background-color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #f5f7fa;
  }

  &.select-option--active {
    color: var(--primary);
    font-weight: 600;
  }
}
// .select-option + .select-option {
//   border-top: 1px solid rgba($color: #000000, $alpha: 0.06);
// }
</style>
