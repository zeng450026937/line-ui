<script lang="ts">
import Vue, { VNode } from 'vue';

export default Vue.extend({
  name: 'Loader',

  functional: true,

  props: {
    active: {
      type: Boolean,
      default: true,
    },
    vnode: [Object, Array],
    component: [Object, Function],
    properties: Object,
  },

  render(h, {
    props, data, children, parent,
  }): VNode {
    const { active, vnode, component } = props;
    if (!active) return h();
    if (!component && !vnode) return h();
    if (vnode) return vnode;
    h = parent.$createElement;
    data.props = props.properties;
    return h(component, data, children);
  },
});
</script>
