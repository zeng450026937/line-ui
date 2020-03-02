import FontIcon from 'skyline/components/icon/font-icon';
import SvgIcon from 'skyline/components/icon/svg-icon';
import { createNamespace } from 'skyline/utils/namespace';

const [createComponent] = createNamespace('icon');

export default /*#__PURE__*/ createComponent({
  functional : true,

  render(h, { data, children }) {
    const hasSource = data.attrs && 'source' in data.attrs;
    if (hasSource) {
      return h(SvgIcon, data, children);
    }
    return h(FontIcon, data, children);
  },

});
