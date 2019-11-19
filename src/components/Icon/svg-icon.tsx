import { convertToUnit } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import '@/components/icon/svg-icon.scss';

const [createComponent, bem] = createNamespace('svg-icon');

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
    data.attrs = Object(data.attrs);
    const text = props.name || slots()[0].text.trim();
    return (
      <div {...data}
        class ={[
          bem(),
          data.class,
        ]}
        style = {{
          width  : convertToUnit(props.width),
          height : convertToUnit(props.height),
          ...data.style as object,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          role="img"
          aria-hidden={!data.attrs!['aria-label']}
          aria-label={data.attrs!['aria-label']}
        >
          {
            text
              ? <use xlinkHref={`${ props.source || '' }#${ text }`}></use>
              : slots('content')
          }
        </svg>
      </div>
    );
  },
});
