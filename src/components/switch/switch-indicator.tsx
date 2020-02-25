import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('switch-indicator');

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
    const children = [
      h('div', { staticClass: 'switch-indicator__thumb' }),
    ];
    return h(tag, {
      ...data,
      staticClass : `switch-indicator ${ data.staticClass || '' }`.trim(),
      class       : {
        'is-checked'  : props.checked,
        'is-disabled' : props.disabled,
        ...data.class,
      },
    }, children);
  },

});
