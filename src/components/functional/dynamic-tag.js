import Vue from 'vue';

export default Vue.extend({
  name: 'DynamicTag',

  functional: true,

  props: {
    tag: {
      type: String,
      default: () => ('div'),
    },
  },

  render(h, context) {
    return h(context.props.tag, context.data, context.children);
  },
});
