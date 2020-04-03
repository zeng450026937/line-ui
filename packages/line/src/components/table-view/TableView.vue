<template>
  <div class="table-view"></div>
</template>

<script>
export default {
  name: 'TableView',

  props: {
    columnSpacing: {
      type: Number,
      default: 0,
    },
    columnWidthProvider: {
      type: Function,
      default: (column) => 0,
    },
    columns: {
      type: Number,
      default: 1,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    reuseItems: {
      type: Boolean,
      default: true,
    },
    rowHeightProvider: {
      type: Function,
      default: (column) => 0,
    },
    rowSpacing: {
      type: Number,
      default: 0,
    },
    rows: {
      type: Number,
      default: 1,
    },
  },

  methods: {
    forceLayout() {},
  },

  mounted() {
    this.$emit('pooled');
    this.$emit('reused');
  },
};
</script>

<style lang="scss"></style>
