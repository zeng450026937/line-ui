import { VNode } from 'vue';
import { SvgIcon } from '@line-ui/line/src/components/icon';
import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-indicator');

let path: VNode | undefined;
const CHECK_PATH = 'M1.73,12.91 8.1,19.28 22.79,4.59';

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    checked       : Boolean,
    indeterminate : Boolean,
    disabled      : Boolean,
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
          content : () => path || (path = h('path', { attrs: { d: CHECK_PATH } })),
        }}
        {...data}
      ></SvgIcon>
    );
  },
});
