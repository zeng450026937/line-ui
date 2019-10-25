import Vue from 'vue';

const AbstractButton = Vue.extend({
  props: {
    action: {
      type: Object,
      default: null,
    },
    autoExclusive: {
      type: Boolean,
      default: false,
    },
    autoRepeat: {
      type: Boolean,
      default: false,
    },
    autoRepeatDelay: {
      type: Number,
      default: 300,
    },
    autoRepeatInterval: {
      type: Number,
      default: 100,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
    display: {
      type: Number,
      default: 0,
    },
    down: {
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
    indicator: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      checked: false,
    };
  },

  methods: {
    toggle() {
      if (this.checkable) {
        this.checked = !this.checked;
      }
    },
  },

  created() {
    // abstract signal defines
    this.$emit('canceled');
    this.$emit('clicked');
    this.$emit('doubleClicked');
    this.$emit('pressAndHold');
    this.$emit('pressed');
    this.$emit('released');
    this.$emit('toggled');
  },
});

AbstractButton[AbstractButton.IconOnly = 0] = 'IconOnly';
AbstractButton[AbstractButton.TextOnly = 1] = 'TextOnly';
AbstractButton[AbstractButton.TextBesideIcon = 2] = 'TextBesideIcon';
AbstractButton[AbstractButton.TextUnderIcon = 3] = 'TextUnderIcon';

export default AbstractButton;
