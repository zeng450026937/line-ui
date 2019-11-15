import { Icon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';
import { isObject } from '@/utils/helpers';
import '@/components/input/input.scss';

const [createComponent, bem] = createNamespace('input');

export default createComponent({
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
    inputValue() {
      let { value } = this;
      value = value === null || value === undefined ? '' : String(value);
      return value;
    },
  },

  mounted() {
    this.$nextTick(this.setInputValue);
  },

  methods : {
    onInput(event: InputEvent): void {
      if (event.isComposing || !event.target) return;
      this.$emit('input', (event.target as HTMLInputElement).value);
      this.$nextTick(this.setInputValue);
    },

    setInputValue(): void {
      const { input } = this.$refs;
      if ((input as HTMLInputElement).value === this.inputValue || !input) return;
      (input as HTMLInputElement).value = this.inputValue;
    },

    onFocus(): void {
      this.isFocus = true;
      this.$emit('onFocus');
    },

    onBlur(): void {
      this.isFocus = false;
      this.$emit('onBlur');
    },

    onClearValue(event: MouseEvent): void {
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

  render() {
    const {
      prefixIcon, suffixIcon, clearable, value, isFocus, label, type,
      maxlength, readonly, placeholderText, autocomplete, disabled,
    } = this;

    return (
      <div class={bem({
        prefix       : prefixIcon,
        suffix       : suffixIcon,
        suffix_clear : clearable && value && isFocus && suffixIcon,
      })}>
        <span class={bem('prefix')}>
          {this.slots('prefix') ? this.slots('prefix')
            : (<icon class='prefix-icon'
               {...{ props: isObject(prefixIcon) ? prefixIcon : { name: prefixIcon } }}
               width="18"
               height="18"></icon>)}
        </span>
        <span class={bem('label')}>
          {this.slots('label') ? this.slots('label') : label }
        </span>
        <input ref="input"
              type={type}
              maxlength={maxlength}
              readonly={readonly}
              placeholder={placeholderText}
              autocomplete={autocomplete}
              disabled={disabled}
              onInput={this.onInput}
              onFocus={this.onFocus}
              onBlur={this.onBlur}>
        </input>
        <span class={bem('suffix')}>
          {this.slots('suffix') ? this.slots('suffix')
            : (<icon class='suffix-icon'
               {...{ props: isObject(suffixIcon) ? suffixIcon : { name: suffixIcon } }}
               width="18"
               height="18"></icon>)}
          {clearable && value && isFocus && (
            <icon class="clearable-icon"
              onMmousedown={(event: MouseEvent) => { this.onClearValue(event); }}
              {...{ props: isObject(this.clearableIcon) ? this.clearableIcon : { name: this.clearableIcon } }}
              width="18"
              height="18"></icon>)}
        </span>
    </div>
    );
  },

});
