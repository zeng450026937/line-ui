<script>
import AbstractIcon from './abstract-icon';
import { convertToUnit } from '@/utils/helpers';

export default {
  name: 'SvgIcon',

  extends: AbstractIcon,

  props: {
    path: String,
  },

  functional: true,

  render(h, { props, data, scopedSlots }) {
    data.attrs = Object(data.attrs);
    const text = props.name || (scopedSlots.default && scopedSlots.default()[0].text.trim());
    const content = scopedSlots.content && scopedSlots.content();
    const tag = 'div';
    let use;
    if (text) {
      use = h('use', {
        attrs: {
          'xlink:href': `${ props.source || '' }#${ text }`,
        },
      });
    }
    const svg = h('svg', {
      attrs: {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        width: '24',
        height: '24',
        role: 'img',
        'aria-hidden': data.attrs['aria-label'],
        'aria-label': data.attrs['aria-label'],
      },
    }, [use || content]);
    return h(tag, {
      ...data,
      staticClass: 'svg-icon',
      style: {
        width: convertToUnit(props.width),
        height: convertToUnit(props.height),
      },
    }, [svg]);
  },
};
</script>

<style lang="scss">

.svg-icon {
  position: relative;
  display: inline-flex;
  vertical-align: middle;

  svg {
    fill: currentColor;
    width: 100%;
    height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
    transition: all .6s ease-in-out
  }
}
</style>
