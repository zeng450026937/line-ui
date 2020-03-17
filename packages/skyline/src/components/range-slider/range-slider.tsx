import { createNamespace } from 'skyline/src/utils/namespace';

export const Orientation = {
  Horizontal : 0,
  Vertical   : 1,
};

export const SnapMode = {
  AsNeeded      : 0,
  AlwaysOff     : 1,
  AlwaysOn      : 2,
  NoSnap        : 3,
  SnapAlways    : 4,
  SnapOnRelease : 5,
};

interface Style {
  height?: any;
  width?: any;
  left?: string;
  top?: string;
}

const { createComponent, bem } = /*#__PURE__*/ createNamespace('range-slider');

export default /*#__PURE__*/ createComponent({
  props : {
    first : {
      type    : Object,
      default : () => ({
        value                : 0,
        position             : 0,
        visualPosition       : 0,
        handle               : {},
        pressed              : false,
        hovered              : false,
        implicitHandleWidth  : 0,
        implicitHandleHeight : 0,
      }),
    },
    from : {
      type    : Number,
      default : 0,
    },
    live : {
      type    : Boolean,
      default : true,
    },
    orientation : {
      type    : Number,
      default : 0,
    },
    second : {
      type    : Object,
      default : () => ({
        value                : 0,
        position             : 0,
        visualPosition       : 0,
        handle               : {},
        pressed              : false,
        hovered              : false,
        implicitHandleWidth  : 0,
        implicitHandleHeight : 0,
      }),
    },
    snapMode : {
      type    : Number,
      default : 0,
    },
    stepSize : {
      type    : Number,
      default : 0,
    },
    to : {
      type    : Number,
      default : 100,
    },
    touchDragThreshold : {
      type    : Number,
      default : 0,
    },
    value : {
      type    : Array,
      default : () => [0, 0],
    },
    height : {
      type    : String,
      default : '100px',
    },
  },

  data() {
    return {
      dragging  : false,
      startX    : 0,
      currentX  : 0,
      startY    : 0,
      currentY  : 0,
      oldValue  : this.value,
      isFirst   : false,
      firstKey  : 0,
      secondKey : 1,

      clientY : 0,
      clientX : 0,
    };
  },

  computed : {
    containerStyle(): Style {
      const style: Style = {};
      if (this.vertical) {
        style.height = this.height;
      }

      return style;
    },

    firstButtonStyle(): Style {
      const style: Style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.firstPosition * 100 }% - 14px)`;

      return style;
    },

    secondButtonStyle(): Style {
      const style: Style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.secondPosition * 100 }% - 14px)`;

      return style;
    },

    barStyle(): Style {
      const style: Style = {};
      if (this.horizontal) {
        style.left = `${ Math.min(this.firstPosition, this.secondPosition) * 100 }%`;
        style.width = `${ Math.abs(this.firstPosition - this.secondPosition) * 100 }%`;
      } else {
        style.top = `${ Math.min(this.firstPosition, this.secondPosition) * 100 }%`;
        style.height = `${ Math.abs(this.firstPosition - this.secondPosition) * 100 }%`;
      }

      return style;
    },

    stepList(): { position: number}[] {
      let list = [];
      const { from, to, stepSize } = this;
      if (!stepSize || stepSize < 0) {
        return [];
      }

      const length = 100 / ((to - from) / stepSize);
      const step = 100 * stepSize / (to - from);
      for (let i = 0; i <= length; i++) {
        list.push({ position: i * step });
      }
      list = list.filter(el => el.position >= from && el.position <= to);

      return list;
    },

    firstPosition(): number {
      const {
        value, from, to, stepSize, firstKey,
      } = this;
      const firstValue = (value[firstKey] as number);

      if (firstValue > to) {
        value[firstKey] = to;
        console.warn('value', this.value[0]);
      } else if (firstValue < from) {
        value[firstKey] = from;
        console.warn('value', this.value[firstKey]);
      }
      let position = (firstValue - from) / (to - from);
      if (stepSize) {
        const length = 100 / ((to - from) / stepSize);
        const steps = Math.round(firstValue / length);
        position = steps / length;
      }

      return position;
    },

    secondPosition(): number {
      const {
        value, from, to, stepSize, secondKey,
      } = this;
      const secondValue = (value[secondKey] as number);

      if (secondValue > to) {
        value[secondKey] = to;
        console.warn('value', this.value[secondKey]);
      } else if (secondValue < from) {
        value[secondKey] = from;
        console.warn('value', this.value[secondKey]);
      }
      let position = (secondValue - from) / (to - from);
      if (stepSize) {
        const length = 100 / ((to - from) / stepSize);
        const steps = Math.round(secondValue / length);
        position = steps / length;
      }

      return position;
    },

    horizontal(): boolean {
      return this.orientation === 0;
    },

    vertical(): boolean {
      return this.orientation === 1;
    },
  },

  beforeMount() {
    this.$emit('first.moved');
    this.$emit('second.moved');
  },

  methods : {
    setValues() { },
    valueAt() { },

    getStepStyle(position: number): Style {
      const style: Style = {};
      const key = this.vertical ? 'top' : 'left';
      style[key] = `${ position }%`;

      return style;
    },

    handleSliderClick(event: MouseEvent): void {
      if (this.disabled || this.dragging) {
        return;
      }
      const clientRect = (this.$refs.slider as Element).getBoundingClientRect();
      let value = 0;
      if (this.vertical) {
        this.currentY = event.clientY - clientRect.top;
        value = Math.round((this.currentY / clientRect.height) * 100);
        this.startY = this.currentY;
      } else {
        this.currentX = event.clientX - clientRect.left;
        value = Math.round((this.currentX / clientRect.width) * 100);
        this.startX = this.currentX;
      }

      const [firstValue, secondValue] = [(this.value[0] as number), (this.value[1] as number)];
      if (value < Math.min(firstValue, secondValue)) {
        firstValue < secondValue
          ? this.$emit('input', [value, secondValue]) : this.$emit('input', [firstValue, value]);
      } else if (value > Math.max(firstValue, secondValue)) {
        firstValue > secondValue
          ? this.$emit('input', [value, secondValue]) : this.$emit('input', [firstValue, value]);
      } else {
        Math.abs(value - firstValue) < Math.abs(value - secondValue)
          ? this.$emit('input', [value, secondValue]) : this.$emit('input', [firstValue, value]);
      }
    },

    onMousedown(event: MouseEvent | TouchEvent, name: string): void {
      this.isFirst = name === 'first';
      if (event.cancelable) {
        event.preventDefault();
      }
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },

    onDragStart(event: MouseEvent | TouchEvent): void {
      this.dragging = true;
      const clientRect = (this.$refs.slider as Element).getBoundingClientRect();
      this.clientY = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientY
        : (event as MouseEvent).clientY;
      this.clientX = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientX
        : (event as MouseEvent).clientX;

      if (this.vertical) {
        this.startY = this.clientY - clientRect.top;
      } else {
        this.startX = this.clientX - clientRect.left;
      }
    },

    onDragging(event: MouseEvent | TouchEvent) {
      if (this.dragging) {
        this.clientY = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientY
          : (event as MouseEvent).clientY;
        this.clientX = event.type === 'touchstart' ? (event as TouchEvent).touches[0].clientX
          : (event as MouseEvent).clientX;

        const clientRect = (this.$refs.slider as Element).getBoundingClientRect();
        let value = 0;
        if (this.vertical) {
          this.currentY = this.clientY - clientRect.top;
          value = Math.round((this.currentY / clientRect.height) * 100);
          if (value > this.to) {
            value = this.to;
          } else if (value < this.from) {
            value = this.from;
          }
          this.startY = this.currentY;
        } else {
          this.currentX = this.clientX - clientRect.left;
          value = Math.round((this.currentX / clientRect.width) * 100);
          this.startX = this.currentX;
          if (value > this.to) {
            value = this.to;
          } else if (value < this.from) {
            value = this.from;
          }
        }
        if (this.isFirst) {
          const newValue = [value, (this.value[this.secondKey] as number)].sort((a, b) => a - b);
          if (this.value[this.secondKey] !== newValue[this.secondKey]) {
            [this.firstKey, this.secondKey] = [this.secondKey, this.firstKey];
          }

          this.$emit('input', newValue);
        } else {
          const newValue = [value, (this.value[this.firstKey] as number)].sort((a, b) => a - b);
          if (this.value[this.firstKey] !== newValue[this.firstKey]) {
            [this.firstKey, this.secondKey] = [this.secondKey, this.firstKey];
          }

          this.$emit('input', newValue);
        }
      }
    },

    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
          this.isFirst = false;
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },
  },

  render() {
    const {
      vertical, dragging, containerStyle, barStyle, firstButtonStyle, secondButtonStyle,
    } = this;

    return (
      <div class={{ 'range-slider': true, 'range-slider--vertical': vertical }}
          style={containerStyle}
          ref="slider">
      <div class="range-slider__container"
            onClick={this.handleSliderClick}>
        {
          this.stepList.map((item, index) => (
            <span class="step"
                  key={index}
                  style={this.getStepStyle(item.position)}></span>
          ))
        }
      </div>
      <div class="range-slider__bar"
            style={barStyle}
            onClick={this.handleSliderClick}></div>
      <div class={{ 'range-slider__button': true, 'is-dragging': dragging }}
      style={firstButtonStyle}
            onMousedown={(event: MouseEvent) => this.onMousedown(event, 'first')}
            onTouchstart={(event: TouchEvent) => this.onMousedown(event, 'first')}
            >
        <span class="bar-label"></span>
      </div>
      <div class={{ 'range-slider__button': true, 'is-dragging': dragging }}
            onMousedown={(event: MouseEvent) => this.onMousedown(event, 'second')}
            onTouchstart={(event: TouchEvent) => this.onMousedown(event, 'second')}
            style={secondButtonStyle}>
        <span class="bar-label"></span>
      </div>
    </div>
    );
  },

});
