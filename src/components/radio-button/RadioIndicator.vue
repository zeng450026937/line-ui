<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'RadioIndicator',

  functional: true,

  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  render(h, { props, data }) {
    const tag = 'div';
    return h(tag, {
      ...data,
      staticClass: `radio-indicator ${ data.staticClass || '' }`.trim(),
      class: {
        ...data.class,
        'is-checked': props.checked,
        'is-disabled': props.disabled,
      },
    });
  },
});
</script>

<style lang="scss">

.radio-indicator {
  display: block;
  width: 18px;
  height: 18px;
  background-color: #fff;
  border: 2px solid #dcdfe6;
  border-radius: 100%;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: #10c29b;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    transform: scale(0, 0);
  }

  &.is-checked {
    border-color: #10c29b;

    &::after {
      transform: scale(1, 1);
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    border-color: rgba($color: #000000, $alpha: 0.2);

    &::after {
      background-color: rgba($color: #000000, $alpha: 0.3);
    }
  }
}

</style>
