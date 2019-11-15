import { isObject } from '@/utils/helpers';
import { Icon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';
import '@/components/text-area/textarea.scss';

const [createComponent, bem] = createNamespace('textarea');

export default createComponent({
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

    inputValue() {
      let { value } = this;
      value = value === null || value === undefined ? '' : String(value);
      return value;
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
    onInput(event: InputEvent): void {
      if (event.isComposing || !event.target) return;
      this.$emit('input', (event.target as HTMLInputElement).value);

      this.$nextTick(this.setInputValue);
    },

    adjustSize(): void {
      const { input } = this.$refs;
      if (!this.autosize || !input) {
        return;
      }

      (input as HTMLElement).style.height = 'auto';

      let height: number = (input as HTMLElement).scrollHeight;
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
        (input as HTMLElement).style.height = `${ height }px`;
      }
    },

    setInputValue(): void {
      const { input } = this.$refs;
      if ((input as HTMLInputElement).value === this.inputValue || !input) {
        return;
      }
      (input as HTMLInputElement).value = this.inputValue;
    },

    onFocus() {
      this.isFocus = true;
      this.$emit('onFocus');
    },

    onBlur() {
      this.isFocus = false;
      this.$emit('onBlur');
    },

    onClearValue(event: UIEvent) {
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

  render() {
    const {
      rows, maxlength, placeholderText, readonly, style, disabled, resize,
    } = this;

    return (
      <div class={bem()}>
        <textarea class={{ 'is--resize': resize }}
          ref='input'
          rows={rows}
          maxlength={maxlength}
          placeholder={placeholderText}
          readonly={readonly}
          disabled={disabled}
          onInput={this.onInput}
          onFocus={this.onFocus}
          onBlur={this.onBlur}></textarea>
          {this.clearable && this.value && this.isFocus && (
            <span class={bem('clearable')}
                  onMousedown={this.onClearValue}>
              <icon {...{
                props : isObject(this.clearableIcon) ? this.clearableIcon : { name: this.clearableIcon },
              }}
              width="20"
              height="20"></icon>
          </span>)}
      </div>
    );
  },

});
