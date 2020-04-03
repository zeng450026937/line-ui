import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { createColorClasses } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('font-icon');

function getDefaultText(slots: Function) {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
}

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    name: String,
    source: String,
    size: String,
    color: String,
  },

  render(h, { props, data, slots }) {
    const { attrs = {} } = data;
    const { name, size, color } = props;
    const text = name || getDefaultText(slots);
    return (
      <i
        class={[
          'line-icon',
          bem({ [`${size}`]: !!size }),
          createColorClasses(color),
        ]}
        aria-hidden={!attrs['aria-label']}
        aria-label={attrs['aria-label'] || text}
        {...data}
      >
        {text}
      </i>
    );
  },
});
