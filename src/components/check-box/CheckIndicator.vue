<script>
import Vue from 'vue';
import { SvgIcon } from '@/components/icon';

let vOnce;

export default Vue.extend({
  name: 'CheckIndicator',

  functional: true,

  components: {
    SvgIcon,
  },

  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  render(h, { props, data }) {
    return h(SvgIcon, {
      ...data,
      staticClass: `check-indicator ${ data.staticClass || '' }`.trim(),
      class: {
        'is-checked': props.checked,
        'is-indeterminate': props.indeterminate,
        'is-disabled': props.disabled,
        ...data.class,
      },
      scopedSlots: {
        content: () => vOnce || (vOnce = h('path', { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } })),
      },
    });
  },
});
</script>

<style lang="scss">

.check-indicator {
  margin-right: 4px;
  border-radius: 2px;
  border: 1px solid #1a1a1a;
  background-color: transparent;
  cursor: pointer;

  svg {
    path {
      fill: none;
      stroke: #ffffff;
      stroke-width: 4;
      transform-origin: center;
      transform: scale(0, 0);
    }
  }

  &.is-checked {
    border-color: #10c29b;
    background-color: #10c29b;

    svg {
      path {
        transition: transform 90ms linear 80ms;
        transition-timing-function: cubic-bezier(0.4, 0, 1, 1),
          cubic-bezier(0.18, 0.89, 0.32, 1.28);
        transform: scale(0.8, 0.8);
      }
    }
  }

  &.is-disabled {
    border-color: #afafaf;
  }
}

</style>
