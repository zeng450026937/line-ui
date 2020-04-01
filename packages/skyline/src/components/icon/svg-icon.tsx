import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('svg-icon');

const getDefaultText = (slots: Function) => {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
};

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    name  : String,
    href  : String,
    src   : String,
    size  : String,
    color : String,
    fill  : {
      type    : Boolean,
      default : true,
    },
    stroke : Boolean,
  },

  render(h, { props, data, slots }) {
    const {
      attrs = {},
    } = data;
    const {
      name, href, src, size, color,
      fill, stroke,
    } = props;
    const text = name || getDefaultText(slots);
    const finalHref = href || `${ src || '' }#${ text }`;
    return (
      <div
        class={[
          bem({
            [`${ size }`]  : !!size,
            'fill-none'    : !fill,
            'stroke-width' : stroke,
          }),
          createColorClasses(color),
        ]}
      >
        <svg
          role="img"
          aria-hidden={!attrs['aria-label']}
          aria-label={attrs['aria-label'] || text}
          {...data}
        >
          {
            text
              ? <use xlinkHref={finalHref}></use>
              : slots('content')
          }
        </svg>
      </div>
    );
  },
});
