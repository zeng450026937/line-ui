import { convertToUnit } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import '@/iconfont/material-icons.scss';

const [createComponent, bem] = createNamespace('font-icon');

function getDefaultText(slots: Function) {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
}

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
    const text = props.name || getDefaultText(slots);
    const size = props.height || props.width;
    return (
      <i
        class={[bem(), 'material-icons']}
        style={{
          'aria-label'     : text,
          'vertical-align' : 'middle',
          'font-size'      : convertToUnit(size),
        }}
        {...data}
      >
        {text}
      </i>
    );
  },
});
