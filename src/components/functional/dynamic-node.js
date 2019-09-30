import Vue from 'vue';

export default Vue.extend({
  name: 'DynamicNode',

  functional: true,

  props: {
    vnode: {
      type: [Object, Array],
      default: null,
    },
  },

  render(h, context) {
    return context.props.vnode;
  },
});
