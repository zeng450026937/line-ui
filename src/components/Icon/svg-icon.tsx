import AbstractIcon from '@/components/icon/abstract-icon';
import { convertToUnit } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import '@/components/icon/svg-icon.scss';

const [createComponent, bem] = createNamespace('svg-icon');

export default createComponent({
  functional : true,

  extends : AbstractIcon,

  props : {
    path : String,
  },


  render(h, { props, data, scopedSlots }) {
    data.attrs = Object(data.attrs);
    const text = props.name || (scopedSlots.default && scopedSlots.default()[0].text.trim());
    const content = scopedSlots.content && scopedSlots.content();
    const tag = 'div';
    let use;
    if (text) {
      use = h('use', {
        attrs : {
          'xlink:href' : `${ props.source || '' }#${ text }`,
        },
      });
    }
    const svg = h('svg', {
      attrs : {
        xmlns         : 'http://www.w3.org/2000/svg',
        viewBox       : '0 0 24 24',
        width         : '24',
        height        : '24',
        role          : 'img',
        'aria-hidden' : !data.attrs['aria-label'],
        'aria-label'  : data.attrs['aria-label'],
      },
    }, [use || content]);
    return h(tag, {
      ...data,
      staticClass : `svg-icon ${ data.staticClass || '' }`.trim(),
      style       : {
        width  : convertToUnit(props.width),
        height : convertToUnit(props.height),
        ...data.style,
      },
    }, [svg]);
  },
});
