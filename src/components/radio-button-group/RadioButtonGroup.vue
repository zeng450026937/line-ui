<template>
  <div class="radio-button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
import Vue from 'vue';
import { createGroup } from '@/components/group';

export default Vue.extend({
  name: 'RadioButtonGroup',

  extends: createGroup('RadioButtonGroup'),

  props: {
    exclusive: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Boolean, Number],
      default: null,
    },
  },

  data() {
    return {

    };
  },

  computed: {

  },

  created() {
    this.$nextTick(() => {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        if (item.value === this.value) {
          item.checked = true;
          break;
        }
      }
    });
  },

  methods: {

  },

  watch: {
    checkedItem(newVal) {
      if (newVal) {
        this.$emit('input', newVal.value);
      }
    },
  },

});
</script>

<style lang="scss">
</style>
