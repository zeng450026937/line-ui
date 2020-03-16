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

const { createComponent, bem } = /*#__PURE__*/ createNamespace('slider');

export default /*#__PURE__*/ createComponent({
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
      position : 0,

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

    buttonStyle(): Style {
      const style: Style = {};
      const key = this.horizontal ? 'left' : 'top';
      style[key] = `calc(${ this.position * 100 }% - 28px)`;

      return style;
    },

    barStyle(): Style {
      const style: Style = {};
      const key = this.horizontal ? 'width' : 'height';
      style[key] = `${ this.position * 100 }%`;

      return style;
    },

    stepList(): { position: number }[] {
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

    horizontal(): boolean {
      return this.orientation === 0;
    },

    vertical(): boolean {
      return this.orientation === 1;
    },

    visualPosition(): boolean {
      return false;
    },
  },

  methods : {
    setPosition(value: number): void {
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

      this.position = position;
    },

    getStepStyle(position: number): Style {
      const style: Style = {};
      const key = this.vertical ? 'top' : 'left';
      style[key] = `${ position }%`;

      return style;
    },

    onSliderClick(event: MouseEvent): void {
      if (this.disabled || this.dragging) {
        return;
      }
      const clientRect = (this.$refs.slider as Element).getBoundingClientRect();
      if (this.vertical) {
        this.currentY = event.clientY - clientRect.top;
        const value = Math.round((this.currentY / clientRect.height) * 100);
        this.$emit('input', value);
        this.startY = this.currentY;
      } else {
        this.currentX = event.clientX! - clientRect.left;
        const value = Math.round((this.currentX / clientRect.width) * 100);
        this.$emit('input', value);
        this.startX = this.currentX;
      }
    },

    onMousedown(event: MouseEvent | TouchEvent): void {
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      // window.addEventListener('touchmove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      // window.addEventListener('touchend', this.onDragEnd);
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

    onDragging(event: MouseEvent | TouchEvent): void {
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

        this.setPosition(value);
        this.$emit('input', value);
      }
    },

    onDragEnd(): void {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        // window.removeEventListener('touchmove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        // window.removeEventListener('touchend', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },
  },

  beforeMount() {
    this.setPosition(this.value);
    this.$emit('moved');
  },

  mounted() {
    const clientRect = (this.$refs.slider as Element).getBoundingClientRect();
    this.clientRect = clientRect;
  },

  render() {
    const {
      vertical, dragging, containerStyle, buttonStyle, barStyle,
    } = this;

    return (
      <div class={bem({ vertical })}
           style={containerStyle}
           ref="slider">
        <div class={bem('container')}
             onClick={this.onSliderClick}>
          {this.stepList.map((item, index) => {
            return (
              <span
                class={{ step: true, 'step--active': item.position <= this.position * 100 }}
                key={index}
                style={this.getStepStyle(item.position)}></span>);
          })}
        </div>
        <div class={bem('bar')}
             style={barStyle}
             onClick={this.onSliderClick}></div>
        <div class={bem('button', { dragging })}
             style={buttonStyle}
             onMousedown={this.onMousedown}
             onTouchstart={this.onMousedown}>
          {/* TODO <span class="bar-label"></span> */}
        </div>
      </div>
    );
  },

});
