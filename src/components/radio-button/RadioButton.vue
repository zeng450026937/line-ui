

<script>
import Vue from 'vue';
import RadioIndicator from './RadioIndicator.vue';
import { AbstractButton } from '@/components/button';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'RadioButtonGroup';

export default Vue.extend({
  name: 'RadioButton',

  mixins: [useGroupItem(NAMESPACE)],

  extends: AbstractButton,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    genIndicator() {
      return this.$createElement(RadioIndicator, {
        props: {
          checked: this.checked,
          disabled: this.disabled,
        },
      });
    },

    onClick() {
      if (this.disabled || this.checked) return;
      if (this.checkable) {
        this.checked = !this.checked;
      }
    },
  },

  created() {
    this.staticClass += ' radio-button';
  },
});
</script>

<style lang="scss">
.radio-button {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    position: absolute;
    user-select: none;
    z-index: -1;
  }
  &__icon {
    display: block;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border: 2px solid #dcdfe6;
    border-radius: 100%;
    box-sizing: border-box;
    position: relative;

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
  }
  &__label {
    color: #666;
    margin-left: 8px;
  }
}
.radio-button--checked {
  .radio-button__icon {
    border-color: #10c29b;

    &::after {
      transform: scale(1, 1);
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.radio-button--disabled {
  cursor: not-allowed;
  .radio-button__icon {
    border-color: rgba($color: #000000, $alpha: 0.2) !important;
    &::after {
      background-color: rgba($color: #000000, $alpha: 0.3) !important;
    }
  }
  .radio-button__label {
    color: rgba($color: #000000, $alpha: 0.4);
  }
}

.radio-button + .radio-button {
  margin-left: 8px;
}
</style>
