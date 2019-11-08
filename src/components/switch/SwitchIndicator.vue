<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name : 'SwitchIndicator',

  functional : true,

  props : {
    checked : {
      type    : Boolean,
      default : false,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, data }) {
    const tag = 'div';
    const children = [
      h('div', { staticClass: 'switch-indicator__thumb' }),
    ];
    return h(tag, {
      ...data,
      staticClass : `switch-indicator ${ data.staticClass || '' }`.trim(),
      class       : {
        'is-checked'  : props.checked,
        'is-disabled' : props.disabled,
        ...data.class,
      },
    }, children);
  },
});
</script>

<style lang="scss">

.switch-indicator {
  position: relative;
  display: inline-flex;
  align-items: center;

  height: 20px;
  width: 42px;

  background-color: rgba($color: #000000, $alpha: 0.15);
  border-radius: 10px;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12) inset,
    0 0 6px rgba(0, 0, 0, 0.04) inset;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.12);
  cursor: pointer;

  &__thumb {
    display: block;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    left: 2px;
    box-shadow: 0 2px 12px 0 rgba($color: #000000, $alpha: 0.1) inset;
    transition: inherit;
  }

  &.is-checked {
    background-color: rgba($color: #10c29b, $alpha: 0.2);
    box-shadow: 0 2px 4px rgba($color: #10c29b, $alpha: 0.22) inset,
      0 0 6px rgba($color: #10c29b, $alpha: 0.14) inset;

    .switch-indicator__thumb {
      background-color: #10c29b;
      left: calc(100% - 18px);
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    background-color: rgba($color: #000000, $alpha: 0.2);
    box-shadow: 0 2px 4px rgba($color: #000000, $alpha: 0.22) inset,
      0 0 6px rgba($color: #000000, $alpha: 0.14) inset;

    .switch-indicator__thumb {
      background-color: rgba($color: #000000, $alpha: 0.2);
    }
  }
}

</style>
