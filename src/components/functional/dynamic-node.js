import Vue from 'vue';

export default Vue.extend({
  name: 'DynamicNode',

  functional: true,

  props: {
    vnode: {
      type: Object,
      default: null,
    },
  },

  render(h) {
    return this.vnode;
  },
});
