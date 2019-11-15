import AbstractIcon from '@/components/icon/abstract-icon';
import { convertToUnit } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import '@/iconfont/material-icons.scss';

const [createComponent, bem] = createNamespace('font-icon');

export default createComponent({
  functional : true,

  extends : AbstractIcon,

  render(h, { props, data, scopedSlots }) {
    const text = props.name || (scopedSlots.default && scopedSlots.default()[0].text.trim());
    const size = props.height || props.width;
    return h('i', {
      ...data,
      staticClass : `font-icon material-icons ${ data.staticClass || '' }`.trim(),
      style       : {
        'vertical-align' : 'middle',
        'font-size'      : convertToUnit(size),
        ...data.style,
      },
    }, text);
  },

});
