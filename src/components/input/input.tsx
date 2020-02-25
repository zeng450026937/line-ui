// import { getSkylineMode } from '@/utils/config';
// import { Icon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';
// import { isObject } from '@/utils/helpers';


const [createComponent, bem] = createNamespace('input');

export default createComponent({
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
      type    : String,
      default : 'text',
    },
    placeholderText : {
      type    : String,
      default : '',
    },
    max : {
      type : String,
    },
    maxlength : {
      type : Number,
    },
    min : {
      type : String,
    },
    size : {
      type : Number,
    },
    readonly : {
      type    : Boolean,
      default : false,
    },
    autofocus : {
      type    : Boolean,
      default : false,
    },
    autocomplete : {
      type    : String,
      default : 'off',
    },
    clearOnEdit : {
      type    : Boolean,
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
      hasFocus         : false,
      didBlurAfterEdit : false,
      // nativeValue      : '',
    };
  },

  methods : {
    setInputValue(): void {
      const { input } = this.$refs;
      if ((input as HTMLInputElement).value === this.inputValue || !input) return;
      (input as HTMLInputElement).value = this.inputValue;
    },

    onInput(ev: Event): void {
      const input = ev.target as HTMLInputElement | null;
      if (input) {
        // this.value = input.value || '';
        this.$emit('input', input.value);
      }
    },

    onBlur(): void {
      this.hasFocus = false;
      this.focusChanged();
      // this.emitStyle(); ?

      this.$emit('onBlur');
    },

    onFocus(): void {
      this.hasFocus = true;
      this.focusChanged();
      // this.emitStyle(); ?

      this.$emit('onFocus');
    },

    onKeydown() {
      if (this.shouldClearOnEdit()) {
        // Did the input value change after it was blurred and edited?
        if (this.didBlurAfterEdit && this.hasValue()) {
          // Clear the input
          this.clearTextInput();
        }

        // Reset the flag
        this.didBlurAfterEdit = false;
      }
    },

    onClearValue(event: MouseEvent): void {
      event.preventDefault();
      event.stopPropagation();

      this.$emit('input', '');
      this.$emit('clear', event);
    },

    getValue(): string {
      return this.value as string || '';
    },

    hasValue(): boolean {
      return this.getValue().length > 0;
    },

    shouldClearOnEdit(): boolean {
      const { type, clearOnEdit } = this;
      return (clearOnEdit === undefined)
        ? type === 'password'
        : clearOnEdit;
    },

    focusChanged(): void {
      // If clearOnEdit is enabled and the input blurred but has a value, set a flag
      if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
        this.didBlurAfterEdit = true;
      }
    },
  },

  watch : {

  },

  render() {
    const {
      value, hasFocus, accept, type, maxlength, readonly, placeholderText, autocomplete, disabled,
      max, min, size, autoFocus, pattern, required,
    } = this;
    // const mode = getSkylineMode(this);

    return (
      <div
        class={[
          bem(),
          {
            // 'has-value' : this.value.length,
            'has-focus' : hasFocus,
          },
        ]}
      >
        <input
          class="native-input"
          ref="input"
          accept={accept}
          type={type}
          value={value}
          size={size}
          maxlength={maxlength}
          max={max}
          min={min}
          readonly={readonly}
          placeholder={placeholderText}
          pattern={pattern}
          required={required}
          autocomplete={autocomplete}
          autoFocus={autoFocus}
          disabled={disabled}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
        </input>
        {(this.clearInput && !readonly && !disabled) && <button
          type="button"
          class="input-clear-icon"
          tabindex="-1"
          onTouchStart={this.clearTextInput}
          onMouseDown={this.clearTextInput}
        />}
    </div>
    );
  },

});
