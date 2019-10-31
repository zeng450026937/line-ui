<script>
import AbstractIcon from './abstract-icon';
import { convertToUnit } from '@/utils/helpers';
import '@/iconfont/material-icons.scss';

export default {
  name: 'FontIcon',

  functional: true,

  extends: AbstractIcon,

  render(h, { props, data, scopedSlots }) {
    const text = props.name || (scopedSlots.default && scopedSlots.default()[0].text.trim());
    const size = props.height || props.width;
    return h('i', {
      ...data,
      style: {
        'font-size': convertToUnit(size),
        'vertical-align': 'middle',
      },
      staticClass: 'material-icons',
    }, text);
  },
};
</script>

<style lang="scss">

</style>
