import { createNamespace } from 'skyline/src/utils/namespace';
import FontIcon from 'skyline/src/components/icon/font-icon';
import SvgIcon from 'skyline/src/components/icon/svg-icon';

const { createComponent } = /*#__PURE__*/ createNamespace('icon');

export default /*#__PURE__*/createComponent({
  functional : true,

  render(h, { data, children }) {
    const { attrs } = data;
    const hasSource = attrs && 'source' in attrs;
    if (hasSource) {
      return h(SvgIcon, data, children);
    }
    return h(FontIcon, data, children);
  },

});
