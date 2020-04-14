import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useModel } from '@line-ui/line/src/mixins/use-model';
import { useColor } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('input');

const findItemLabel = (componentEl: HTMLElement) => {
  const itemEl = componentEl && componentEl.closest('.line-item');
  if (itemEl) {
    return itemEl.querySelector('.line-label');
  }
  return null;
};

let inputIds = 0;

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ useModel('nativeValue', { event: 'inputChange' }),
    /*#__PURE__*/ useColor(),
  ],

  inject: {
    Item: { default: undefined },
  },

  props: {
    accept: String,
    autocapitalize: {
      type: String,
      default: 'off',
    },
    autocomplete: {
      type: String,
      default: 'off',
    },
    autocorrect: {
      type: String,
      default: 'off',
    },
    autofocus: Boolean,
    clearInput: Boolean,
    clearOnEdit: Boolean,
    inputmode: {
      type: String,
      default: 'text',
    },
    max: String,
    maxlength: Number,
    min: String,
    multiple: Boolean,
    pattern: String,
    placeholder: String,
    readonly: Boolean,
    size: Number,
    type: {
      type: String,
      default: 'text',
    },
    disabled: Boolean,
  },

  data() {
    return {
      hasFocus: false,
      didBlurAfterEdit: false,
    };
  },

  methods: {
    /**
     * Sets focus on the specified `line-input`. Use this method instead of the global
     * `input.focus()`.
     */
    setFocus() {
      if (this.nativeInput) {
        this.nativeInput.focus();
      }
    },

    /**
     * Returns the native `<input>` element used under the hood.
     */
    getInputElement(): Promise<HTMLInputElement> {
      return Promise.resolve(this.nativeInput!);
    },

    disabledChanged() {
      this.emitStyle();
    },

    shouldClearOnEdit() {
      const { type, clearOnEdit } = this;
      return clearOnEdit === undefined ? type === 'password' : clearOnEdit;
    },

    getValue(): string {
      return typeof this.nativeValue === 'number'
        ? this.nativeValue.toString()
        : (this.nativeValue || '').toString();
    },

    emitStyle() {
      if (!this.Item) return;

      this.Item.itemStyle('input', {
        interactive: true,
        input: true,
        'has-placeholder': this.placeholder != null,
        'has-value': this.hasValue(),
        'has-focus': this.hasFocus,
        'interactive-disabled': this.disabled,
      });
    },

    setInputValue(): void {
      const { input } = this.$refs;
      if ((input as HTMLInputElement).value === this.inputValue || !input)
        return;
      (input as HTMLInputElement).value = this.inputValue;
    },

    onInput(ev: Event): void {
      const input = ev.target as HTMLInputElement | null;
      if (input) {
        this.nativeValue = input.value || '';
      }
    },

    onBlur(): void {
      this.hasFocus = false;
      this.focusChanged();
      this.emitStyle();

      this.$emit('blur');
    },

    onFocus(): void {
      this.hasFocus = true;
      this.focusChanged();
      this.emitStyle();

      this.$emit('focus');
    },

    onChange() {
      //
    },

    onKeydown(ev: KeyboardEvent) {
      if (this.shouldClearOnEdit()) {
        // Did the input value change after it was blurred and edited?
        // Do not clear if user is hitting Enter to submit form
        if (this.didBlurAfterEdit && this.hasValue() && ev.key !== 'Enter') {
          // Clear the input
          this.clearTextInput();
        }

        // Reset the flag
        this.didBlurAfterEdit = false;
      }
    },

    clearTextInput(ev?: Event) {
      if (this.clearInput && !this.readonly && !this.disabled && ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      // TODO
      // this.value = '';

      this.nativeValue = '';

      /**
       * This is needed for clearOnEdit
       * Otherwise the value will not be cleared
       * if user is inside the input
       */
      if (this.nativeInput) {
        this.nativeInput.value = '';
      }
    },

    focusChanged() {
      // If clearOnEdit is enabled and the input blurred but has a value, set a flag
      if (!this.hasFocus && this.shouldClearOnEdit() && this.hasValue()) {
        this.didBlurAfterEdit = true;
      }
    },

    hasValue(): boolean {
      return this.getValue().length > 0;
    },

    onClearValue(event: MouseEvent): void {
      event.preventDefault();
      event.stopPropagation();

      this.nativeValue = '';
      this.$emit('clear', event);
    },
  },

  beforeMount() {
    this.inputId = `line-input-${inputIds++}`;
    this.emitStyle();
  },

  mounted() {
    const { nativeInput } = this.$refs;
    this.nativeInput = nativeInput;
  },

  watch: {
    disabled() {
      this.disabledChanged();
    },

    nativeValue() {
      this.emitStyle();
    },
  },

  render() {
    const labelId = `${this.inputId}-lbl`;
    const label = findItemLabel(this.$el as HTMLElement);

    const {
      nativeValue,
      hasFocus,
      accept,
      type,
      maxlength,
      readonly,
      placeholder,
      autocomplete,
      disabled,
      max,
      min,
      size,
      autoFocus,
      pattern,
      required,
    } = this;

    if (label) {
      label.id = labelId;
    }

    return (
      <div
        class={[
          bem({
            suffix: this.slots('suffix'),
          }),
          {
            'has-value': nativeValue && (nativeValue as string).length,
            'has-focus': hasFocus,
          },
        ]}
        on={this.$listeners}
      >
        <input
          class={bem('content')}
          ref="nativeInput"
          accept={accept}
          type={type}
          value={nativeValue}
          size={size}
          maxlength={maxlength}
          max={max}
          min={min}
          readonly={readonly}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
          autocomplete={autocomplete}
          autoFocus={autoFocus}
          disabled={disabled}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
        ></input>
        {this.slots('suffix')}
        {this.clearInput && !readonly && !disabled && (
          <button
            type="button"
            class="input-clear-icon"
            tabindex="-1"
            onTouchStart={this.clearTextInput}
            onMouseDown={this.clearTextInput}
            onClick={this.clearTextInput}
          />
        )}
      </div>
    );
  },
});
