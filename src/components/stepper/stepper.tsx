import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';
import { convertToUnit } from '@/utils/helpers';

import './stepper.scss';

const [createComponent, bem] = createNamespace('stepper');

export default createComponent({
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
    inputValue(): number {
      const { min, max } = this;
      let { value } = this;
      if (value === null || value === undefined || Number.isNaN(value)) {
        value = min !== -Infinity ? min : 1;
      }
      return value;
    },
  },

  mounted() {
    this.$nextTick(this.setInputValue);
  },

  methods : {
    onChange(type: String) {
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
      if ((input as HTMLInputElement).value === convertToUnit(this.inputValue, '') || !input) {
        return;
      }

      (input as HTMLInputElement).value = String(this.inputValue);
    },

    onBlur(event: UIEvent) {
      this.$emit('blur', event);
    },
    onFocus(event: UIEvent) {
      this.$emit('focus', event);
    },
    onInput(event: InputEvent) {
      let { value }: {value: number | string} = (event.target! as HTMLInputElement);
      value = Number.parseFloat(value);
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
      handler() {
        this.onChange('init');
      },
      immediate : true,
    },

    inputValue() {
      this.setInputValue();
    },
  },

  render() {
    const {
      placeholder, disabled, max, min, step, number, value,
    } = this;
    return (
      <div class={bem()}>
        <span class={bem('button', { disabled: value <= min })}
              onClick={() => this.onChange('reduce')}>
          <icon name='remove' width='24' height='24'></icon>
        </span>
        <input
          ref='input'
          placeholder={placeholder}
          disabled={disabled}
          max={max}
          min={min}
          step={step}
          type={number}
          on={{
            '!blur'  : this.onBlur,
            '!input' : this.onInput,
            '!focus' : this.onFocus,
          }}></input>
        <span class={bem('button', { disabled: value >= max })}
              onClick={() => this.onChange('add')}>
          <icon name='add' width='24' height='24'></icon>
        </span>
      </div>
    );
  },
});
