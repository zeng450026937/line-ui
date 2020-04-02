import { createNamespace } from 'skyline/src/utils/namespace';
import {
  createGesture,
  GestureDetail,
} from 'skyline/src/utils/gesture';
import { useColor } from 'skyline/src/mixins/use-color';

import { Rect } from 'skyline/src/utils/layout';

export type KnobName = 'A' | 'B' | undefined;

export type RangeValue = number | {lower: number; upper: number};

interface RangeKnob {
  knob: string;
  value: number;
  ratio: number;
  min: number;
  max: number;
  disabled: boolean;
  pressed: boolean;
  pin: boolean;

  handleKeyboard: (name: string, isIncrease: boolean) => void;
}

const { createComponent, bem } = /*#__PURE__*/ createNamespace('range');

function clamp(value: number, min: number, max: number): number {
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}

const renderKnob = (h: any, isRTL: boolean, {
  knob, value, ratio, min, max, disabled, pressed, pin, handleKeyboard,
}: RangeKnob) => {
  const start = isRTL ? 'right' : 'left';

  const knobStyle = () => {
    const style: any = {};

    style[start] = `${ ratio * 100 }%`;

    return style;
  };

  return (
    <div
      class={[
        bem('knob-handle', {
          min : value === min,
          max : value === max,
        }),
        {
          'line-range__knob--pressed' : pressed,
          'range-knob-a'              : knob === 'A',
          'range-knob-b'              : knob === 'B',
        },
      ]}
      onKeyDown={(ev: KeyboardEvent) => {
        const { key } = ev;
        if (key === 'ArrowLeft' || key === 'ArrowDown') {
          handleKeyboard(knob, false);
          ev.preventDefault();
          ev.stopPropagation();
        } else if (key === 'ArrowRight' || key === 'ArrowUp') {
          handleKeyboard(knob, true);
          ev.preventDefault();
          ev.stopPropagation();
        }
      }}
      style={knobStyle()}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled ? 'true' : null}
      aria-valuenow={value}
    >
      {pin && (
        <div
          class={bem('pin')}
          role="presentation"
        >
          {Math.round(value)}
        </div>
      )}
      <div
        class={bem('knob')}
        role="presentation" />
    </div>
  );
};

const ratioToValue = (
  ratio: number,
  min: number,
  max: number,
  step: number,
): number => {
  let value = (max - min) * ratio;
  if (step > 0) {
    value = Math.round(value / step) * step + min;
  }
  return clamp(min, value, max);
};

const valueToRatio = (value: number, min: number, max: number): number => {
  return clamp(0, (value - min) / (max - min), 1);
};

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  inject : {
    Item : { default: undefined },
  },

  props : {
    text     : String,
    debounce : {
      type    : Number,
      default : 0,
    },
    dualKnobs : Boolean,
    min       : {
      type    : Number,
      default : 0,
    },
    max : {
      type    : Number,
      default : 100,
    },
    pin   : Boolean,
    snaps : Boolean,
    step  : {
      type    : Number,
      default : 1,
    },
    ticks    : Boolean,
    disabled : Boolean,
    value    : {
      type    : [Number, Object],
      default : 0,
    },
  },

  data() {
    let pressedKnob: KnobName;
    let rangeSlider: HTMLElement | undefined;
    let rect!: Rect;

    return {
      hasFocus : false,
      noUpdate : false,
      pressedKnob,
      rangeSlider,
      rect,
      ratioA   : 0,
      ratioB   : 0,
    };
  },

  computed : {
    valA(): number {
      return ratioToValue(this.ratioA, this.min, this.max, this.step);
    },

    valB(): number {
      return ratioToValue(this.ratioB, this.min, this.max, this.step);
    },

    ratioLower(): number {
      if (this.dualKnobs) {
        return Math.min(this.ratioA, this.ratioB);
      }
      return 0;
    },

    ratioUpper(): number {
      if (this.dualKnobs) {
        return Math.max(this.ratioA, this.ratioB);
      }
      return this.ratioA;
    },
  },

  watch : {
    disabled() {
      this.disabledChanged();
    },
  },

  beforeMount() {
    this.updateRatio();
    // this.debounceChanged();
    this.disabledChanged();
  },

  async mounted() {
    const { rangeSlider } = this.$refs;

    if (rangeSlider) {
      this.gesture = createGesture({
        el              : rangeSlider as Element,
        gestureName     : 'range',
        gesturePriority : 100,
        threshold       : 0,
        onStart         : ev => this.onStart(ev),
        onMove          : ev => this.onMove(ev),
        onEnd           : ev => this.onEnd(ev),
      });
      this.gesture.enable(!this.disabled);
    }
  },

  methods : {
    disabledChanged() {
      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
      this.emitStyle();
    },
    valueChanged(value: RangeValue) {
      if (!this.noUpdate) {
        this.updateRatio();
      }

      value = this.ensureValueInBounds(value);

      this.$emit('change', { value });
    },

    clampBounds(value: any): number {
      return clamp(this.min, value, this.max);
    },

    ensureValueInBounds(value: any) {
      if (this.dualKnobs) {
        return {
          lower : this.clampBounds(value.lower),
          upper : this.clampBounds(value.upper),
        };
      }
      return this.clampBounds(value);
    },

    handleKeyboard(knob: string, isIncrease: boolean): void {
      let { step } = this;
      step = step > 0 ? step : 1;
      step /= (this.max - this.min);
      if (!isIncrease) {
        step *= -1;
      }
      if (knob === 'A') {
        this.ratioA = clamp(0, this.ratioA + step, 1);
      } else {
        this.ratioB = clamp(0, this.ratioB + step, 1);
      }
      this.updateValue();
    },

    getValue(): number | RangeValue {
      const value: number | RangeValue = this.value || 0;
      if (this.dualKnobs) {
        if (typeof value === 'object') {
          return value;
        }
        return {
          lower : 0,
          upper : value as number,
        };
      }
      if (typeof value === 'object') {
        return (value.upper as number);
      }
      return (value as number);
    },

    emitStyle() {
      if (!this.Item) return;
      this.Item.itemStyle(
        'range',
        {
          interactive            : true,
          'interactive-disabled' : this.disabled,
        },
      );
    },

    onStart(detail: GestureDetail) {
      const { rangeSlider } = this.$refs;
      const rect = this.rect = (rangeSlider as HTMLElement).getBoundingClientRect() as any;
      const { currentX } = detail;

      // figure out which knob they started closer to
      let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
      if (document.dir === 'rtl') {
        ratio = 1 - ratio;
      }

      this.pressedKnob = !this.dualKnobs
        || Math.abs(this.ratioA - ratio) < Math.abs(this.ratioB - ratio)
        ? 'A'
        : 'B';

      this.setFocus(this.pressedKnob);

      // update the active knob's position
      this.update(currentX);
    },

    onMove(detail: GestureDetail) {
      this.update(detail.currentX);
    },

    onEnd(detail: GestureDetail) {
      this.update(detail.currentX);
      this.pressedKnob = undefined;
    },

    update(currentX: number) {
      // figure out where the pointer is currently at
      // update the knob being interacted with
      const { rect } = this;
      let ratio = clamp(0, (currentX - rect.left) / rect.width, 1);
      if (document.dir === 'rtl') {
        ratio = 1 - ratio;
      }

      if (this.snaps) {
        // snaps the ratio to the current value
        ratio = valueToRatio(
          ratioToValue(ratio, this.min, this.max, this.step),
          this.min,
          this.max,
        );
      }

      // update which knob is pressed
      if (this.pressedKnob === 'A') {
        this.ratioA = ratio;
      } else {
        this.ratioB = ratio;
      }

      // Update input value
      this.updateValue();
    },


    updateRatio() {
      const value = this.getValue() as any;
      const { min, max } = this;
      if (this.dualKnobs) {
        this.ratioA = valueToRatio(value.lower, min, max);
        this.ratioB = valueToRatio(value.upper, min, max);
      } else {
        this.ratioA = valueToRatio(value, min, max);
      }
    },

    updateValue() {
      this.noUpdate = true;

      const { valA, valB } = this;

      const value = !this.dualKnobs
        ? valA
        : {
          lower : Math.min(valA, valB),
          upper : Math.max(valA, valB),
        };
      this.$emit('input', value);
      this.noUpdate = false;
    },

    setFocus(knob: string) {
      const knobEl = this.$el.querySelector(
        knob === 'A' ? '.range-knob-a' : '.range-knob-b',
      ) as HTMLElement | undefined;
      if (knobEl) {
        knobEl.focus();
      }
    },

    onBlur() {
      if (this.hasFocus) {
        this.hasFocus = false;
        this.$emit('blur');
        this.emitStyle();
      }
    },

    onFocus() {
      if (!this.hasFocus) {
        this.hasFocus = true;
        this.$emit('focus');
        this.emitStyle();
      }
    },
  },

  render(h) {
    const {
      min, max, step, handleKeyboard, pressedKnob, disabled, pin, ratioLower, ratioUpper,
    } = this;

    const barStart = `${ ratioLower * 100 }%`;
    const barEnd = `${ 100 - ratioUpper * 100 }%`;

    const doc = document;
    const isRTL = doc.dir === 'rtl';
    const start = isRTL ? 'right' : 'left';
    const end = isRTL ? 'left' : 'right';

    const tickStyle = (tick: any) => {
      return {
        [start] : tick[start],
      };
    };

    const barStyle = {
      [start] : barStart,
      [end]   : barEnd,
    };

    const ticks: {ratio: number; active: boolean}[] = [];

    if (this.snaps && this.ticks) {
      for (let value = min; value <= max; value += step) {
        const ratio = valueToRatio(value, min, max);

        const tick: any = {
          ratio,
          active : ratio >= ratioLower && ratio <= ratioUpper,
        };

        tick[start] = `${ ratio * 100 }%`;

        ticks.push(tick);
      }
    }
    // renderHiddenInput(true, el, this.name, JSON.stringify(this.getValue()), disabled);
    return (
      <div
        class={bem({
          disabled,
          pressed   : pressedKnob !== undefined,
          'has-pin' : pin,
        })}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      >
        {this.slots('start')}
        <div
          class={bem('slider')}
          ref="rangeSlider"
        >
          {ticks.map(tick => (
            <div
              style={tickStyle(tick)}
              role="presentation"
              class={bem('tick', {
                active : tick.active,
              })}
            />
          ))}

          <div
            class={bem('bar')}
            role="presentation" />
          <div
            class={bem('bar', { active: true })}
            role="presentation"
            style={barStyle}
          />

          { renderKnob(h, isRTL, {
            knob    : 'A',
            pressed : pressedKnob === 'A',
            value   : this.valA,
            ratio   : this.ratioA,
            pin,
            disabled,
            handleKeyboard,
            min,
            max,
          })}

          { this.dualKnobs && renderKnob(h, isRTL, {
            knob    : 'B',
            pressed : pressedKnob === 'B',
            value   : this.valB,
            ratio   : this.ratioB,
            pin,
            disabled,
            handleKeyboard,
            min,
            max,
          })}
        </div>
        {this.slots('end')}
      </div>
    );
  },
});
