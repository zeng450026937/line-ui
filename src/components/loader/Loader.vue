<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'Loader',

  functional: true,

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    component: {
      type: [Object, Function],
      default: null,
    },
    properties: {
      type: Object,
      default: () => ({}),
    },
  },

  render(h, {
    props, data, children, parent,
  }) {
    const { active, component } = props;
    if (!active || !component) return h();
    h = parent.$createElement;
    data.props = props.properties;
    return h(component, data, children);
  },
});
</script>

<style>

</style>
