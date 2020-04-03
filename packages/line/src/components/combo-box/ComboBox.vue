<template>
  <div class="combo-box"></div>
</template>

<script>
export default {
  name: 'ComboBox',

  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    displayText: {
      type: String,
      default: '',
    },
    down: {
      type: Boolean,
      default: false,
    },
    editText: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    indicator: {
      type: Object,
      default: () => ({}),
    },
    inputMethodHints: {
      type: String,
      default: '',
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    popup: {
      type: Object,
      default: () => ({}),
    },
    pressed: {
      type: Boolean,
      default: false,
    },
    textRole: {
      type: String,
      default: '',
    },
    validator: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    acceptableInput() {
      return false;
    },
    count() {
      return 0;
    },
    currentText() {
      return '';
    },
    highlightedIndex() {
      return 0;
    },
  },

  methods: {
    decrementCurrentIndex() {},
    find() {},
    incrementCurrentIndex() {},
    selectAll() {},
    textAt() {},
  },

  created() {
    this.$emit('accepted');
    this.$emit('activated');
    this.$emit('highlighted');
  },
};
</script>

<style lang="scss"></style>
