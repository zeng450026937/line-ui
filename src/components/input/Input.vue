<template>
  <div :class="bem({'prefix': prefixIcon,
                    'suffix': suffixIcon,
                    'suffix_clear':clearable && value && isFocus && suffixIcon })">
    <span :class="bem('prefix')">
      <slot name="prefix">
        <icon class="prefix-icon"
              v-bind="isObject(prefixIcon) ? prefixIcon : {name: prefixIcon}"
              width="18"
              height="18"></icon>
      </slot>
    </span>
    <span :class="bem('label')">
      <slot name="label">{{label}}</slot>
    </span>
    <input ref="input"
           :type="type"
           :maxlength="maxlength"
           :readonly="readonly"
           :placeholder="placeholderText"
           :autocomplete="autocomplete"
           :disabled="disabled"
           @input="onInput"
           @focus="onFocus"
           @blur="onBlur">
    <span :class="bem('suffix')">
      <slot name="suffix">
        <icon class="suffix-icon"
              v-bind="isObject(suffixIcon) ? suffixIcon : {name: suffixIcon}"
              width="18"
              height="18"></icon>
      </slot>
      <icon class="clearable-icon"
            v-if="clearable && value && isFocus"
            @mousedown="onClearValue"
            v-bind="isObject(clearableIcon) ? clearableIcon : {name: clearableIcon}"
            width="18"
            height="18"></icon>
    </span>
  </div>
</template>

<script>
import { isObject } from '@/utils/helpers';
import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('input');

export default {
  name : 'Input',

  components : {
    Icon,
  },

  props : {
    prefixIcon : {
      type : [String, Object],
    },
    suffixIcon : {
      type : [String, Object],
    },
    label : {
      type    : String,
      default : '',
    },
    value : {
      type    : [String, Number],
      default : '',
    },
    type : {
      type    : [String],
      default : 'text',
    },
    placeholderText : {
      type    : String,
      default : '',
    },
    maxlength : {
      type : Number,
    },
    readonly : {
      type    : Boolean,
      default : false,
    },
    autocomplete : {
      type    : String,
      default : 'off',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
    clearable : {
      type    : Boolean,
      default : false,
    },
    clearableIcon : {
      type    : String,
      default : 'cancel',
    },
  },

  data() {
    return {
      isFocus     : false,
      nativeValue : '',
    };
  },

  computed : {
    isObject() {
      return isObject;
    },

    bem() {
      return bem;
    },

    inputValue() {
      let { value } = this;
      value = value === null || value === undefined ? '' : String(value);
      return value;
    },

  },

  created() {

  },

  mounted() {
    this.$nextTick(this.setInputValue);
  },

  methods : {
    onInput(event) {
      if (event.target.composing) {
        return;
      }
      this.$emit('input', event.target.value);

      this.$nextTick(this.setInputValue);
    },

    setInputValue() {
      const { input } = this.$refs;
      if (input.value === this.inputValue || !input) {
        return;
      }
      input.value = this.inputValue;
    },

    onFocus() {
      this.isFocus = true;
      this.$emit('onFocus');
    },

    onBlur() {
      this.isFocus = false;
      this.$emit('onBlur');
    },

    onClearValue(event) {
      event.preventDefault();
      event.stopPropagation();

      this.$emit('input', '');
      this.$emit('clear', event);
    },
  },

  watch : {
    inputValue() {
      this.setInputValue();
    },
  },
};
</script>

<style lang="scss" scoped>
.line-input {
  height: 38px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  input {
    height: 100%;
    width: 100%;
    font-size: inherit;
    line-height: 1;
    color: #1a1a1a;
    padding: 0 20px;
    padding-right: 30px;
    outline: none;
    background-color: #ffffff;
    border: solid 1px #ebebeb;
    display: block;
    box-sizing: border-box;
    resize: none;
    border-radius: 4px;
  }
  &__prefix {
    position: absolute;
    left: 8px;
    top: 8px;
    .prefix-icon {
      color: #c0c0c0;
      cursor: default;
    }
  }
  &__suffix {
    position: absolute;
    right: 8px;
    top: 8px;
    .suffix-icon {
      color: #c0c0c0;
      cursor: default;
    }
    .clearable-icon {
      color: #999999;
      cursor: pointer;
      &:hover {
        color: #afafaf;
      }
    }
  }
}
.line-input--prefix {
  input {
    padding-left: 30px;
  }
}
.line-input--suffix {
  input {
    padding-right: 30px;
  }
}

.line-input--suffix_clear {
  input {
    padding-right: 50px;
  }
}

input:-internal-autofill-selected {
  background-color: #ffffff !important;
  background-image: none !important;
  color: #1a1a1a !important;
}
</style>
