<template>
  <div :class="bem()">
    <span :class="bem('button', {'disabled': value <= min})"
          @click="onChange('reduce')">
      <icon name="remove"
            width="24"
            height="24"></icon>
    </span>
    <input ref="input"
           :placeholder="placeholder"
           :disabled="disabled"
           :max="max"
           :min="min"
           :step="step"
           type="number"
           @blur="onBlur"
           @focus="onFocus"
           @input="onInput">
    <span :class="bem('button', {'disabled': value >= max})"
          @click="onChange('add')">
      <icon name="add"
            width="24"
            height="24"></icon>
    </span>
  </div>
</template>

<script>
import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('stepper');

export default {
  name : 'Stepper',

  components : {
    Icon,
  },

  props : {
    min : {
      type    : Number,
      default : -Infinity,
    },
    max : {
      type    : Number,
      default : Infinity,
    },
    step : {
      type    : Number,
      default : 1,
    },
    value : {
      type : Number,
    },
    readonly : {
      type    : Boolean,
      default : false,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
    placeholder : {
      type    : String,
      default : '',
    },
    precision : {
      type : Number,
      validator(value) {
        return value >= 0;
      },
    },
  },

  data() {
    return {
      nativeValue : '',
    };
  },

  computed : {
    bem() {
      return bem;
    },

    inputValue() {
      const { min, max } = this;
      let { value } = this;
      if (value === null || value === undefined || Number.isNaN(value)) {
        value = min !== -Infinity ? min : 1;
      }
      return value;
    },
  },

  created() {

  },

  mounted() {
    this.$nextTick(this.setInputValue);
  },

  methods : {
    onChange(type) {
      const {
        step, max, min, precision,
      } = this;
      let { value } = this;

      if (type === 'add') {
        value += step;
      } else if (type === 'reduce') {
        value -= step;
      }
      value = Math.max(value, min);
      value = Math.min(value, max);
      value = value === -Infinity || value === Infinity ? 1 : value;

      this.$emit('input', value);
      this.$emit('change', value);
    },

    setInputValue() {
      const { input } = this.$refs;
      if (input.value === this.inputValue || !input) {
        return;
      }

      input.value = this.inputValue;
    },

    onBlur(event) {
      this.$emit('blur', event);
    },
    onFocus(event) {
      this.$emit('focus', event);
    },
    onInput(event) {
      let { value } = event.target;
      const {
        step, max, min, precision,
      } = this;
      value = Math.max(value, min);
      value = Math.min(value, max);
      value = value === -Infinity || value === Infinity ? 1 : value;

      this.$emit('input', value);
      this.$emit('change', value);
      this.$nextTick(this.setInputValue);
    },
  },

  watch : {
    value : {
      handler(newVal, oldval) {
        this.onChange('init');
      },
      immediate : true,
    },

    inputValue() {
      this.setInputValue();
    },
  },
};
</script>

<style lang="scss" scoped>
.line-stepper {
  height: 44px;
  color: #1a1a1a;
  font-size: inherit;
  display: flex;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  input {
    min-width: 50px;
    width: 80px;
    height: 44px;
    padding: 0 8px;
    text-align: center;
    background-color: #ffffff;
    margin: 0 4px;
    border: none;
    outline: none;
    box-shadow: none;
  }
  &__button {
    width: 54px;
    height: 44px;
    background-color: var(--dark-light);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    position: relative;
  }
  &__button--disabled {
    pointer-events: none;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0.4;
      background-color: #ffffff;
      z-index: 99;
    }
  }
  &__button:nth-of-type(1) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &__button:nth-last-of-type(1) {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
