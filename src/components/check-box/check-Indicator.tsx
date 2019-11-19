import { VNode } from 'vue';
import { SvgIcon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';

import '@/components/check-box/check-box.scss';

const [createComponent, bem] = createNamespace('check-box');
let path: VNode;

export default createComponent({
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
        {...data}
        class={[
          bem({
            checked       : props.checked,
            indeterminate : props.indeterminate,
            disabled      : props.disabled,
          }),
          data.class,
        ]}
        scopedSlots={{
          content : () => path || (path = h('path', { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } })),
        }}
      ></SvgIcon>
    );
  },
});
