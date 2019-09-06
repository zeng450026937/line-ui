<template>
  <div class="menu" v-show="visable">
  </div>
</template>

<script>
import { Popup } from '@/components/popup';

export default {
  name: 'Menu',

  extends: Popup,

  props: {
    cascade: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    overlap: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },

  computed: {
    contentModel() {
      return {};
    },
    count() {
      return 0;
    },
  },

  methods: {
    popup() {},
    actionAt() {},
    addAction() {},
    addItem() {},
    addMenu() {},
    dismiss() {},
    insertAction() {},
    insertItem() {},
    insertMenu() {},
    itemAt() {},
    menuAt() {},
    moveItem() {},
    removeAction() {},
    removeItem() {},
    removeMenu() {},
    takeAction() {},
    takeItem() {},
    takeMenu() {},
  },
};
</script>

<style lang="scss">

</style>
