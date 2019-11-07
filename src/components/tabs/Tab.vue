<template>
  <div class="tabs__nav-item"
       :class="{'is-active': checked}"
       @click="onClick">
    <slot name="title">
      {{title}}
    </slot>
    <!-- <slot name="default"></slot> -->
  </div>
</template>

<script>
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'Tabs';

export default {
  name: 'Tab',

  mixins: [useGroupItem(NAMESPACE)],

  components: {

  },

  props: {
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {

    };
  },

  computed: {

  },

  created() {

  },

  mounted() {

  },

  methods: {
    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },

  watch: {

  },
};
</script>

<style lang="scss" scoped>
.tabs__nav-item {
  &:hover {
    color: var(--primary);
  }
  &.is-active {
    color: var(--primary);
  }
}
</style>
