import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';
import {
  config,
  getMode,
} from 'skyline/src/utils/config';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('font-icon');

function getDefaultText(slots: Function) {
  const nodes = slots();
  const text = (nodes && nodes[0].text) || '';
  return text.trim();
}

function getIconClass() {
  const mode = getMode();
  const iconClass = config.get('iconFontClass');
  if (iconClass) {
    return iconClass;
  }
  return mode === 'md' ? 'material-icons' : '';
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
    const { attrs = {} } = data;
    const { name, size, color } = props;
    const text = name || getDefaultText(slots);
    const iconClass = getIconClass();
    return (
      <i
        class={[
          'line-icon',
          iconClass && iconClass,
          bem({ [`${ size }`]: !!size }),
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
