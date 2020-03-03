import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('progress');

export default /*#__PURE__*/ createComponent({
  props : {
    from : {
      type    : Number,
      default : 0,
    },
    to : {
      type    : Number,
      default : 100,
    },
    value : {
      type    : Number,
      default : 0,
    },
    bufferValue : {
      type    : Number,
      default : 0,
    },
    stream : {
      type    : Boolean,
      default : false,
    },
    indeterminate : {
      type    : Boolean,
      default : false,
    },
    height : {
      type    : [Number, String],
      default : 4,
    },
    color : {
      type    : String,
      default : '#10c29b',
    },
  },


  computed : {
    style(): object {
      const style = { height: '4px' };
      style.height = `${ this.height.toString().replace(/px/, '') }px`;
      return style;
    },

    bufferBarStyle(): object {
      const { color, bufferPosition } = this;
      const style = {
        backgroundColor : `${ color }20`,
        transform       : `scaleX(${ bufferPosition })`,
      };
      if (this.bufferValue) {
        style.backgroundColor = `${ color }60`;
      }
      return style;
    },

    streamBarStyle(): object {
      if (!this.stream) {
        return {};
      }
      const { color, position, bufferPosition } = this;
      const style = {
        borderColor : `${ color }80`,
        width       : `${ (1 - position) * 100 }%`,
      };

      if (this.bufferValue) {
        style.width = `${ (1 - bufferPosition) * 100 }%`;
      }

      return style;
    },

    bufferPosition(): number {
      let { bufferValue } = this;
      if (!bufferValue) {
        return 1;
      }
      const { to, from } = this;
      if (bufferValue > to) {
        bufferValue = to;
        console.warn('bufferValue', this.bufferValue);
      } else if (bufferValue < from) {
        bufferValue = from;
        console.warn('bufferValue', this.bufferValue);
      }
      const position = (bufferValue - from) / (to - from);

      return position;
    },

    position(): number {
      if (this.indeterminate) {
        return 0;
      }
      const { to, from } = this;
      let { value } = this;
      if (value > to) {
        value = to;
        console.warn('value', this.value);
      } else if (value < from) {
        value = from;
        console.warn('value', this.value);
      }
      const position = (value - from) / (to - from);

      return position;
    },
  },

  render() {
    let children: any[] = [];
    const {
      color, indeterminate, stream, bufferBarStyle, position, streamBarStyle, style,
    } = this;
    const bufferBar = (
      <div class="line-progress__buffer-bar" style={bufferBarStyle}></div>
    );
    if (indeterminate) {
      [1, 2].forEach(() => {
        const indeterminateBar = (
          <div class="line-progress__bar-wrap">
            <div class="line-progress__indeterminate-bar" style={{ 'background-color': color }}>
            </div>
          </div>
        );
        children.push(indeterminateBar);
      });
    } else {
      const progressBar = (
        <div
          class="line-progress__bar"
          style={{
            backgroundColor : color,
            transform       : `scaleX(${ position })`,
          }}>
        </div>
      );
      children = [progressBar];
    }
    children.push(bufferBar);

    if (!indeterminate && stream) {
      const streamBar = (
        <div class="line-progress__stream-bar" style={streamBarStyle}></div>
      );
      children.push(streamBar);
    }
    return (
      <div class={bem()} style={style}>
        {children}
      </div>
    );
  },
});
