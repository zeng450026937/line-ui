<template>
  <div :class="bem()"
       @click="onClick">
    <slot name="default">
    </slot>
  </div>
</template>

<script>
import { useGroupItem } from '@/components/group';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('menu-item');
const NAMESPACE = 'Menu';

export default {
  name : 'MenuItem',

  mixins : [useGroupItem(NAMESPACE)],

  props : {
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    bem() {
      return bem;
    },
  },

  methods : {
    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.line-menu-item {
  width: 100%;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
