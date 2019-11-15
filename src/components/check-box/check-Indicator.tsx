import { VNode } from 'vue';
import { SvgIcon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';

import '@/components/check-box/check-box.scss';


const [createComponent, bem] = createNamespace('check-box');

let vOnce: VNode;

export default createComponent({
  functional : true,

  components : {
    SvgIcon,
  },

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
    return h(SvgIcon, {
      ...data,
      staticClass : `check-indicator ${ data.staticClass || '' }`.trim(),
      class       : {
        'is-checked'       : props.checked,
        'is-indeterminate' : props.indeterminate,
        'is-disabled'      : props.disabled,
        ...data.class,
      },
      scopedSlots : {
        content : () => vOnce || (vOnce = h('path', { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } })),
      },
    });
  },
});
