import { createNamespace } from '@/utils/namespace';
import '@/components/radio-button/radio-indicator.scss';

const [createComponent, bem] = createNamespace('radio-indicator');

export default createComponent({
  functional : true,

  props : {
    checked : {
      type    : Boolean,
      default : false,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, data }) {
    const tag = 'div';
    return h(tag, {
      ...data,
      staticClass : `radio-indicator ${ data.staticClass || '' }`.trim(),
      class       : {
        'is--checked'  : props.checked,
        'is--disabled' : props.disabled,
        ...data.class,
      },
    });
  },
});
