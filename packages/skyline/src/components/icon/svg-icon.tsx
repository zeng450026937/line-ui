import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('svg-icon');

function getDefaultText(slots: Function) {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
}

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    name   : String,
    source : String,
    size   : String,
    color  : String,
  },

  render(h, { props, data, slots }) {
    const {
      attrs = {},
    } = data;
    const {
      name, source, size, color,
    } = props;
    const text = name || getDefaultText(slots);
    const href = `${ source || '' }#${ text }`;
    return (
      <div
        class={[
          'line-icon',
          bem({ [`${ size }`]: !!size }),
          createColorClasses(color),
        ]}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden={!attrs['aria-label']}
          aria-label={attrs['aria-label'] || text}
          {...data}
        >
          {
            text
              ? <use href={href} xlinkHref={href}></use>
              : slots('content')
          }
        </svg>
      </div>
    );
  },
});
