import { createNamespace } from 'skyline/utils/namespace';
import { createColorClasses } from 'skyline/mixins/use-color';

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
    size   : String,
    color  : String,
  },

  render(h, { props, data, slots }) {
    const { name, size, color } = props;
    const text = name || getDefaultText(slots);
    return (
      <i
        class={[
          'line-icon',
          'material-icons',
          bem({ [`${ size }`]: !!size }),
          createColorClasses(color),
        ]}
        aria-hidden={!data.attrs!['aria-label']}
        aria-label={data.attrs!['aria-label'] || text}
        {...data}
      >
        {text}
      </i>
    );
  },
});
