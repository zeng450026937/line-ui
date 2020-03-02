import { VNode } from 'vue';
import { SvgIcon } from 'skyline/components/icon';
import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('check-indicator');
let path: VNode;

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    checked : {
      type    : Boolean,
      default : false,
    },
    indeterminate : {
      type    : Boolean,
      default : false,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, data }) {
    return (
      <SvgIcon
        class={bem({
          checked       : props.checked,
          indeterminate : props.indeterminate,
          disabled      : props.disabled,
        })}
        scopedSlots={{
          content : () => path || (path = h('path', { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } })),
        }}
        {...data}
      ></SvgIcon>
    );
  },
});
