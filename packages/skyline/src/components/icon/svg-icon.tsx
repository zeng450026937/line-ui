import { createNamespace } from 'skyline/utils/namespace';
import { createColorClasses } from 'skyline/mixins/use-color';

const [createComponent, bem] = createNamespace('svg-icon');

function getDefaultText(slots: Function) {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
}

export default createComponent({
  functional : true,

  props : {
    name    : String,
    source  : String,
    size    : String,
    color   : String,
    viewBox : String,
    outline : Boolean,
  },

  render(h, { props, data, slots }) {
    data.attrs = Object(data.attrs);
    const {
      name, size, color, viewBox, outline,
    } = props;
    const text = name || getDefaultText(slots);
    const href = `${ props.source || '' }#${ text }`;
    return (
      <div
        class={[
          'line-icon',
          bem({ [`${ size }`]: !!size }),
          createColorClasses(color),
        ]}
        {...data}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          viewBox={viewBox}
          aria-hidden={!data.attrs!['aria-label']}
          aria-label={data.attrs!['aria-label'] || text}
        >
          {
            text
              ? <use href={href} xlinkHref={href} class={{
                'line-icon-fill-none'    : outline,
                'line-icon-stroke-width' : outline,
              }}></use>
              : slots('content')
          }
        </svg>
      </div>
    );
  },
});
