<template>
  <div class="badge">
    <slot name="default"></slot>
    <span class="badge__content"
          v-show="visible">
      {{value}}
    </span>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Badge',

  props: {
    value: {
      type: Number,
      default: 0,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    visible(newVal) {
      console.log(newVal);
    },
  },

  created() {

  },

  methods: {

  },
});
</script>

<style lang="scss">
.badge {
  display: inline-block;
  position: relative;
  &__content {
    display: inline-flex;
    height: 20px;
    color: #fff;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    border: 1px solid #fff;
    border-radius: 10px;
    background-color: #ed4014;
    padding: 0 8px;
    position: absolute;
    top: -9px;
    right: 0px;
    transform: translateX(50%);
  }
}
</style>
