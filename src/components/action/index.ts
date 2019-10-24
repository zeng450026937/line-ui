import Vue from 'vue';

const Action = Vue.extend({
  props: {
    checkable: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Object,
      default: () => ({
        name: '',
        source: '',
        width: 24,
        height: 24,
        color: '',
      }),
    },
    shortcut: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },

  methods: {
    toggle() {},
    trigger() {},
  },

  created() {
    this.$emit('toggled');
    this.$emit('triggered');
  },

});

export { Action };
