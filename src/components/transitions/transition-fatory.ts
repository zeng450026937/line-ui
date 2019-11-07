import Vue, { VNode } from 'vue';

export function createTransition(name: string, mode?: string) {
  return Vue.extend({
    name,

    functional: true,

    props: {
      group: {
        type: Boolean,
        default: false,
      },
      mode: {
        type: String,
        default: mode,
      },
    },

    render(h, context): VNode {
      const { props } = context.data;
      const tag = `transition${ props!.group ? '-group' : '' }`;
      context.data.props = {
        name,
        mode: props!.mode,
      };
      return h(tag, context.data, context.children);
    },
  });
}
