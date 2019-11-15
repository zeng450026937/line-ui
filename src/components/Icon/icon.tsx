import Vue, { VNode } from 'vue';
import FontIcon from './FontIcon.vue';
import SvgIcon from '@/components/icon/SvgIcon.vue';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('icon');

export default createComponent({
  functional : true,

  render(h, { data, children }): VNode {
    const hasSource = data.attrs && 'source' in data.attrs;
    if (hasSource) {
      return h(SvgIcon, data, children);
    }
    return h(FontIcon, data, children);
  },

});
