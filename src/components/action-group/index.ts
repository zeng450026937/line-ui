import Vue from 'vue';

const ActionGroup = Vue.extend({
  props: {
    actions: {
      type: Array,
      default: () => ([]),
    },
    checkedAction: {
      type: Object,
      default: null,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    exclusive: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    addAction() {},
    removeAction() {},
  },

  created() {
    this.$emit('triggered');
  },
});

export default ActionGroup;
