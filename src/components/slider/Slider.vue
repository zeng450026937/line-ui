<template>
  <div class="slider"
       :class="{'slider--vertical': vertical}"
       :style="containerStyle"
       ref="slider">
    <div class="slider__container"
         @click="handleSliderClick">
      <span class="step"
            v-for="(item, index) in stepList"
            :key="index"
            :class="{'step--active': item.position <= position * 100}"
            :style="getStepStyle(item.position)"></span>
    </div>
    <div class="slider__bar"
         :style="barStyle"
         @click="handleSliderClick"></div>
    <div class="slider__button"
         :class="{'is-dragging': dragging}"
         @mousedown="onMousedown"
         @touchstart="onMousedown"
         :style="buttonStyle">
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
  name : 'Slider',

  props : {
    from : {
      type    : Number,
      default : 0,
    },
    handle : {
      type    : Object,
      default : () => ({}),
    },
    live : {
      type    : Boolean,
      default : true,
    },
    orientation : {
      type    : Number,
      default : 0,
    },
    pressed : {
      type    : Boolean,
      default : true,
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
      type    : Number,
      default : 0,
    },
    height : {
      type    : String,
      default : '100px',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    return {
      dragging : false,
      startX   : 0,
      currentX : 0,
      startY   : 0,
      currentY : 0,
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

    buttonStyle() {
      const style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.position * 100 }% - 28px)`;

      return style;
    },

    barStyle() {
      const style = {};
      const key = this.horizontal ? 'width' : 'height';
      style[key] = `${ this.position * 100 }%`;

      return style;
    },

    position() {
      let { value } = this;
      const { from, to, stepSize } = this;

      if (value > to) {
        value = to;
        console.warn('value', this.value);
      } else if (value < from) {
        value = from;
        console.warn('value', this.value);
      }
      let position = (value - from) / (to - from);
      if (stepSize) {
        const length = 100 / ((to - from) / stepSize);
        const steps = Math.round(value / length);
        position = steps / length;
      }

      return position;
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

    horizontal() {
      return this.orientation === 0;
    },

    vertical() {
      return this.orientation === 1;
    },

    visualPosition() {
      return false;
    },
  },

  methods : {
    decrease() { },
    increase() { },
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
      if (this.vertical) {
        this.currentY = event.clientY - clientRect.top;
        const value = Math.round((this.currentY / clientRect.height) * 100);
        this.$emit('input', value);
        this.startY = this.currentY;
      } else {
        this.currentX = event.clientX - clientRect.left;
        const value = Math.round((this.currentX / clientRect.width) * 100);
        this.$emit('input', value);
        this.startX = this.currentX;
      }
    },

    onMousedown(event) {
      event.preventDefault();
      this.onDragStart(event);
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
        // this.value = value;
        this.$emit('input', value);
      }
    },

    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
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
    this.$emit('moved');
  },
};
</script>

<style lang="scss">
.slider {
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
  }

  &__button {
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -28px;
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
.slider--vertical {
  width: 2px;
  .slider__button {
    left: -28px;
  }
  .slider__container {
    .step {
      left: 0px;
    }
  }
}
</style>
