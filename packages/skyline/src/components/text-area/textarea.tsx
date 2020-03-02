import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('textarea');

export default /*#__PURE__*/ createComponent({
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
      isFocus          : false,
      didBlurAfterEdit : false,
    };
  },

  computed : {
    selectedText() {
      return '';
    },

    inputValue() {
      let { value } = this;
      value = value === null || value === undefined ? '' : String(value);
      return value;
    },
  },

  created() {
    // this.$emit('pressAndHold');
    // this.$emit('pressed');
    // this.$emit('released');
  },

  mounted() {
    // this.$nextTick(this.setInputValue);
    // this.$nextTick(this.adjustSize);
  },

  methods : {
    setInputValue(): void {
      const { input } = this.$refs;
      if ((input as HTMLInputElement).value === this.inputValue || !input) {
        return;
      }
      (input as HTMLInputElement).value = this.inputValue;
    },

    onClearValue(event: UIEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.$emit('input', '');
      this.$emit('clear');
    },

    hasValue(): boolean {
      return this.getValue() !== '';
    },

    getValue(): string {
      return this.value as string || '';
    },

    /**
     * Check if we need to clear the text input if clearOnEdit is enabled
     */
    checkClearOnEdit() {
      if (!this.clearOnEdit) {
        return;
      }

      // Did the input value change after it was blurred and edited?
      if (this.didBlurAfterEdit && this.hasValue()) {
      // Clear the input
        this.$emit('input', '');
      }

      // Reset the flag
      this.didBlurAfterEdit = false;
    },

    focusChange() {
      // If clearOnEdit is enabled and the input blurred but has a value, set a flag
      if (this.clearOnEdit && !this.hasFocus && this.hasValue()) {
        this.didBlurAfterEdit = true;
      }
      // this.emitStyle(); ?
    },

    onInput(): void {
      const { textarea } = this.$refs;
      if (textarea) {
        this.$emit('input', (textarea as HTMLInputElement).value);
      }
      // his.emitStyle(); ?
    },

    onFocus(): void {
      this.hasFocus = true;
      this.focusChange();

      this.$emit('onFocus');
    },

    onBlur(): void {
      this.hasFocus = false;
      this.focusChange();

      this.$emit('onBlur');
    },

    onKeyDown(): void {
      this.checkClearOnEdit();
    },
  },

  watch : {
    value(value) {
      const { textarea } = this.$ref;
      if (textarea && textarea.value !== value) {
        textarea.value = value;
      }
    },
  },

  render() {
    // const mode = getSkylineMode(this);
    const value = this.getValue();
    const {
      rows, maxlength, placeholderText, readonly, disabled, autocapitalize, autofocus,
    } = this;

    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        <textarea
          class="native-textarea"
          ref='textarea'
          autoCapitalize={autocapitalize}
          autoFocus={autofocus}
          rows={rows}
          maxlength={maxlength}
          placeholder={placeholderText}
          readonly={readonly}
          disabled={disabled}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        >
          {value}
        </textarea>
      </div>
    );
  },

});
