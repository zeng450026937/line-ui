<template>
  <div class="check-box-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { useGroup, CheckState } from '@/components/group';

export { CheckState };

const NAMESPACE = 'CheckBoxGroup';

export default Vue.extend({
  name: 'CheckBoxGroup',

  mixins: [useGroup(NAMESPACE)],

  props: {
    nextCheckState: {
      type: Function,
      default(checkState) {
        return checkState === CheckState.Checked ? CheckState.Unchecked : CheckState.Checked;
      },
    },
  },

  methods: {
    onClick() {
      if (this.checkable && !this.disabled) {
        this.checkState = this.nextCheckState(this.checkState);
      }
    },
  },
});
</script>

<style lang="scss">
// .check-box-group > .check-box + .check-box {
//   margin-left: 8px;
// }
</style>
