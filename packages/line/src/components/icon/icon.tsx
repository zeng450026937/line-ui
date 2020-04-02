import { createNamespace } from '@line-ui/line/src/utils/namespace';
import FontIcon from '@line-ui/line/src/components/icon/font-icon';
import SvgIcon from '@line-ui/line/src/components/icon/svg-icon';

const { createComponent } = /*#__PURE__*/ createNamespace('icon');

export default /*#__PURE__*/createComponent({
  functional : true,

  render(h, { data, children }) {
    const { attrs } = data;
    const hasSrc = attrs && ('src' in attrs || 'href' in attrs);
    if (hasSrc) {
      return h(SvgIcon, data, children);
    }
    return h(FontIcon, data, children);
  },

});
