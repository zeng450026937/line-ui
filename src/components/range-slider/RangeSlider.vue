<template>
  <div class="range-slider"
       :class="{'range-slider--vertical': vertical}"
       :style="containerStyle"
       ref="slider">
    <div class="range-slider__container"
         @click="handleSliderClick">
      <span class="step"
            v-for="(item, index) in stepList"
            :key="index"
            :style="getStepStyle(item.position)"></span>
    </div>
    <div class="range-slider__bar"
         :style="barStyle"
         @click="handleSliderClick"></div>
    <div class="range-slider__button"
         :class="{'is-dragging': dragging}"
         @mousedown="onMousedown($event, 'first')"
         @touchstart="onMousedown($event, 'first')"
         :style="firstButtonStyle">
      <span class="bar-label"></span>
    </div>
    <div class="range-slider__button"
         :class="{'is-dragging': dragging}"
         @mousedown="onMousedown($event, 'second')"
         @touchstart="onMousedown($event, 'second')"
         :style="secondButtonStyle">
      <span class="bar-label"></span>
    </div>
  </div>
</template>

<script>
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

export default {
  name : 'RangeSlider',

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
    };
  },

  computed : {
    containerStyle() {
      const style = {};
      if (this.vertical) {
        style.height = this.height;
      }

      return style;
    },

    firstButtonStyle() {
      const style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.firstPosition * 100 }% - 14px)`;

      return style;
    },

    secondButtonStyle() {
      const style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.secondPosition * 100 }% - 14px)`;

      return style;
    },

    barStyle() {
      const style = {};
      if (this.horizontal) {
        style.left = `${ Math.min(this.firstPosition, this.secondPosition) * 100 }%`;
        style.width = `${ Math.abs(this.firstPosition - this.secondPosition) * 100 }%`;
      } else {
        style.top = `${ Math.min(this.firstPosition, this.secondPosition) * 100 }%`;
        style.height = `${ Math.abs(this.firstPosition - this.secondPosition) * 100 }%`;
      }

      return style;
    },

    stepList() {
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

    firstPosition() {
      // const { value } = this;
      const {
        value, from, to, stepSize, firstKey,
      } = this;

      if (value[firstKey] > to) {
        value[firstKey] = to;
        console.warn('value', this.value[0]);
      } else if (value[firstKey] < from) {
        value[firstKey] = from;
        console.warn('value', this.value[firstKey]);
      }
      let position = (value[firstKey] - from) / (to - from);
      if (stepSize) {
        const length = 100 / ((to - from) / stepSize);
        const steps = Math.round(value[firstKey] / length);
        position = steps / length;
      }

      return position;
    },

    secondPosition() {
      const {
        value, from, to, stepSize, secondKey,
      } = this;

      if (value[secondKey] > to) {
        value[secondKey] = to;
        console.warn('value', this.value[secondKey]);
      } else if (value[secondKey] < from) {
        value[secondKey] = from;
        console.warn('value', this.value[secondKey]);
      }
      let position = (value[secondKey] - from) / (to - from);
      if (stepSize) {
        const length = 100 / ((to - from) / stepSize);
        const steps = Math.round(value[secondKey] / length);
        position = steps / length;
      }

      return position;
    },

    horizontal() {
      return this.orientation === 0;
    },

    vertical() {
      return this.orientation === 1;
    },
  },

  methods : {
    setValues() { },
    valueAt() { },

    getStepStyle(position) {
      const style = {};
      const key = this.vertical ? 'top' : 'left';
      style[key] = `${ position }%`;

      return style;
    },

    handleSliderClick(event) {
      if (this.disabled || this.dragging) {
        return;
      }
      const clientRect = this.$refs.slider.getBoundingClientRect();
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

      if (value < Math.min(this.value[0], this.value[1])) {
        this.value[0] < this.value[1]
          ? this.$emit('input', [value, this.value[1]]) : this.$emit('input', [this.value[0], value]);
      } else if (value > Math.max(this.value[0], this.value[1])) {
        this.value[0] > this.value[1]
          ? this.$emit('input', [value, this.value[1]]) : this.$emit('input', [this.value[0], value]);
      } else {
        Math.abs(value - this.value[0]) < Math.abs(value - this.value[1])
          ? this.$emit('input', [value, this.value[1]]) : this.$emit('input', [this.value[0], value]);
      }
    },

    onMousedown(event, name) {
      this.isFirst = name === 'first';
      if (event.cancelable) {
        event.preventDefault();
      }
      this.onDragStart(event, name);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('touchend', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },

    onDragStart(event) {
      this.dragging = true;
      const clientRect = this.$refs.slider.getBoundingClientRect();
      if (event.type === 'touchstart') {
        event.clientY = event.touches[0].clientY;
        event.clientX = event.touches[0].clientX;
      }
      if (this.vertical) {
        this.startY = event.clientY - clientRect.top;
      } else {
        this.startX = event.clientX - clientRect.left;
      }
    },

    onDragging(event) {
      if (this.dragging) {
        if (event.type === 'touchmove') {
          event.clientY = event.touches[0].clientY;
          event.clientX = event.touches[0].clientX;
        }
        const clientRect = this.$refs.slider.getBoundingClientRect();
        let value = 0;
        if (this.vertical) {
          this.currentY = event.clientY - clientRect.top;
          value = Math.round((this.currentY / clientRect.height) * 100);
          if (value > this.to) {
            value = this.to;
          } else if (value < this.from) {
            value = this.from;
          }
          this.startY = this.currentY;
        } else {
          this.currentX = event.clientX - clientRect.left;
          value = Math.round((this.currentX / clientRect.width) * 100);
          this.startX = this.currentX;
          if (value > this.to) {
            value = this.to;
          } else if (value < this.from) {
            value = this.from;
          }
        }
        if (this.isFirst) {
          const newValue = [value, this.value[this.secondKey]].sort((a, b) => a - b);
          if (this.value[this.secondKey] !== newValue[this.secondKey]) {
            [this.firstKey, this.secondKey] = [this.secondKey, this.firstKey];
          }

          this.$emit('input', newValue);
        } else {
          const newValue = [value, this.value[this.firstKey]].sort((a, b) => a - b);
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

  created() {
    this.$emit('first.moved');
    this.$emit('second.moved');
  },
};
</script>

<style lang="scss">
.range-slider {
  position: relative;
  height: 2px;
  &__container {
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.2);
    cursor: pointer;
    .step {
      width: 2px;
      height: 2px;
      background-color: rgba($color: #000000, $alpha: 0.8);
      position: absolute;
      top: 0px;
      border-radius: 50%;
      z-index: -1;
    }
    .step--active {
      background-color: #10c29b;
    }
  }

  &__bar {
    width: 100%;
    height: 100%;
    background-color: #10c29b;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
  }

  &__button {
    width: 28px;
    height: 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -14px;
    &::after {
      content: '';
      display: block;
      height: 28px;
      width: 28px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 1px 6px 0 rgba($color: #000000, $alpha: 0.3),
        0 0px 4px 0 rgba($color: #000000, $alpha: 0.1) inset;
    }
    &:hover {
      cursor: grab;
    }

    &.is-dragging {
      cursor: grabbing;
    }
  }
}
.range-slider--vertical {
  width: 2px;
  .range-slider__button {
    left: -14px;
  }
  .range-slider__container {
    .step {
      left: 0px;
    }
  }
}
</style>
