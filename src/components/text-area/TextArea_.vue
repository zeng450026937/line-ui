<template>
  <div :class="bem()">
    <textarea :class="{'is--resize': resize}"
              ref="input"
              :rows="rows"
              :maxlength="maxlength"
              :placeholder="placeholderText"
              :readonly="readonly"
              :style="style"
              :disabled="disabled"
              @input="onInput"
              @focus="onFocus"
              @blur="onBlur"></textarea>
    <span v-if="clearable && value  && isFocus"
          :class="bem('clearable')"
          @mousedown="onClearValue">
      <icon v-bind="isObject(clearableIcon) ? clearableIcon : {name: clearableIcon}"
            width="20"
            height="20"></icon>
    </span>
  </div>
</template>

<script>
import { isObject } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';
import { Icon } from '../icon';

const [createComponent, bem, t] = createNamespace('text-area');

export default {
  name       : 'TextArea',
  components : {
    Icon,
  },

  props : {
    canPaste : {
      type    : Boolean,
      default : true,
    },
    canRedo : {
      type    : Boolean,
      default : true,
    },
    canUndo : {
      type    : Boolean,
      default : true,
    },
    persistentSelection : {
      type    : Boolean,
      default : false,
    },
    readonly : {
      type    : Boolean,
      default : false,
    },
    resize : {
      type    : Boolean,
      default : false,
    },
    text : {
      type    : String,
      default : '',
    },
    hoverEnabled : {
      type    : Boolean,
      default : true,
    },

    value : {
      type    : [String, Number],
      default : '',
    },
    placeholderText : {
      type    : String,
      default : '',
    },
    placeholderTextColor : {
      type    : String,
      default : '',
    },
    rows : {
      type    : Number,
      default : 2,
    },
    maxlength : {
      type : Number,
    },
    autosize : {
      type    : [Boolean, Object],
      default : false,
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
      isFocus : false,
    };
  },

  computed : {
    selectedText() {
      return '';
    },

    style() {
      const style = {};
      // if (!this.resize) {
      //   style.resize = 'none';
      // }
      return style;
    },

    inputValue() {
      let { value } = this;
      value = value === null || value === undefined ? '' : String(value);
      return value;
    },

    bem() {
      return bem;
    },

    isObject() {
      return isObject;
    },
  },

  created() {
    this.$emit('pressAndHold');
    this.$emit('pressed');
    this.$emit('released');
  },

  mounted() {
    this.$nextTick(this.setInputValue);
    this.$nextTick(this.adjustSize);
  },

  methods : {
    onInput(event) {
      if (event.target.composing) {
        return;
      }
      this.$emit('input', event.target.value);

      this.$nextTick(this.setInputValue);
    },

    adjustSize() {
      const { input } = this.$refs;
      if (!this.autosize || !input) {
        return;
      }

      input.style.height = 'auto';

      let height = input.scrollHeight;
      if (isObject(this.autosize)) {
        const { maxHeight, minHeight } = this.autosize;
        if (maxHeight) {
          height = Math.min(height, maxHeight);
        }
        if (minHeight) {
          height = Math.max(height, minHeight);
        }
      }

      if (height) {
        input.style.height = `${ height }px`;
      }
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
    value() {
      this.$nextTick(this.adjustSize);
    },

    inputValue() {
      this.setInputValue();
    },

    rows() {
      this.$nextTick(this.adjustSize);
    },
  },
};
</script>

<style lang="scss">
.line-text-area {
  width: 100%;
  position: relative;
  textarea {
    display: block;
    width: 100%;
    min-height: 38px;
    color: #1a1a1a;
    font-size: inherit;
    line-height: 1.5;
    background-color: #ffffff;
    border: 1px solid #ebebeb;
    padding: 5px 16px;
    padding-right: 22px;
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
    resize: none;
  }
  &__clearable {
    position: absolute;
    right: 4px;
    top: 7px;
    color: #999999;
    cursor: pointer;
    &:hover {
      color: #afafaf;
    }
  }
  &.is--resize {
    resize: vertical;
  }
}
</style>
