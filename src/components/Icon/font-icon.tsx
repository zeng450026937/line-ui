import { convertToUnit } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import '@/iconfont/material-icons.scss';

const [createComponent, bem] = createNamespace('font-icon');

export default createComponent({
  functional : true,

  props : {
    name   : String,
    source : String,
    width  : {
      type    : [Number, String],
      default : 24,
    },
    height : {
      type    : [Number, String],
      default : 24,
    },
    color : String,
  },

  render(h, { props, data, slots }) {
    const text = props.name || slots()[0].text.trim();
    const size = props.height || props.width;
    return (
      <i {...data}
        class={[bem(), 'material-icons', data.class]}
        style={{
          'vertical-align' : 'middle',
          'font-size'      : convertToUnit(size),
          ...data.style as object,
        }}
      >
        {text}
      </i>
    );
  },
});
