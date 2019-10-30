<script>
import AbstractIcon from './abstract-icon';
import '@/iconfont/material-icons.scss';

export default {
  name: 'FontIcon',

  functional: true,

  extends: AbstractIcon,

  render(h, { props, data, scopedSlots }) {
    const text = props.name || (scopedSlots.default && scopedSlots.default()[0].text.trim());
    return h('i', {
      ...data,
      style: {
        'font-size': `${ props.height || props.width }px`,
        'vertical-align': 'middle',
      },
      staticClass: 'material-icons',
    }, text);
  },
};
</script>

<style lang="scss">

</style>
