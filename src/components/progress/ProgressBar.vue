<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'ProgressBar',

  props: {
    from: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
      default: 0,
    },
    bufferValue: {
      type: Number,
      default: 0,
    },
    stream: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
      default: 4,
    },
    color: {
      type: String,
      default: '#10c29b',
    },
  },

  computed: {
    style() {
      const style = { height: '4px' };
      style.height = `${ this.height.toString().replace(/px/, '') }px`;
      return style;
    },

    bufferBarStyle() {
      const { color, bufferPosition } = this;
      const style = {
        backgroundColor: `${ color }20`,
        transform: `scaleX(${ bufferPosition })`,
      };
      if (this.bufferValue) {
        style.backgroundColor = `${ color }60`;
      }
      return style;
    },

    streamBarStyle() {
      if (!this.stream) {
        return {};
      }
      const { color, position, bufferPosition } = this;
      const style = {
        borderColor: `${ color }80`,
        width: `${ (1 - position) * 100 }%`,
      };

      if (this.bufferValue) {
        style.width = `${ (1 - bufferPosition) * 100 }%`;
      }

      return style;
    },

    bufferPosition() {
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

    position() {
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

  render(h) {
    const tag = 'div';
    const { color, indeterminate, stream } = this;
    const bufferBar = h(tag, {
      staticClass: 'progress__buffer-bar',
      style: this.bufferBarStyle,
    });
    let children = [];
    if (indeterminate) {
      [1, 2].forEach(() => {
        const indeterminateBar = h(tag, {
          staticClass: 'progress__bar-wrap',
        }, [h(tag, {
          staticClass: 'progress__indeterminate-bar',
          style: {
            'background-color': color,
          },
        })]);
        children.push(indeterminateBar);
      });
    } else {
      const progressBar = h(tag, {
        staticClass: 'progress__bar',
        style: {
          'background-color': color,
          transform: `scaleX(${ this.position })`,
        },
      });

      children = [progressBar];
    }
    children.push(bufferBar);

    if (!indeterminate && stream) {
      const streamBar = h(tag, {
        staticClass: 'progress__stream-bar',
        style: this.streamBarStyle,
      });
      children.push(streamBar);
    }

    return h(tag, {
      staticClass: 'progress',
      style: this.style,
    }, children);
  },
});
</script>

<style lang="scss">
.progress {
  width: 100%;
  height: 4px;
  margin: 3px 0;
  position: relative;
  overflow: hidden;
  transition: transform 0.4s linear 0s;

  &__bar {
    width: 100%;
    height: 100%;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    transform-origin: left top;
    transition: inherit;
    z-index: 1;
  }
  &__buffer-bar {
    width: 100%;
    height: 100%;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    transform-origin: left top;
    transition: inherit;
  }

  &__stream-bar {
    border-top: dotted 4px #10c29b80;
    position: absolute;
    right: 0;
    transition: width 0.6s linear 0s;
    animation: stream 0.25s infinite linear;
  }

  .progress__bar-wrap {
    width: 100%;
    height: 100%;
    left: -130%;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    transform-origin: left top;
    animation-name: indeterminate-translate_animation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    .progress__indeterminate-bar {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      right: 0px;
      top: 0px;
      bottom: 0px;
      animation-name: indeterminate-scale_animation;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-play-state: inherit;
    }
  }
  .progress__bar-wrap:nth-of-type(2) {
    top: 0;
    right: 0;
    bottom: 0;
    left: -54.888891%;
    animation: secondary-indeterminate-translate 2s infinite linear;

    .progress__indeterminate-bar {
      animation: secondary-indeterminate-scale 2s infinite linear;
      animation-play-state: inherit;
    }
  }
}

@keyframes indeterminate-translate_animation {
  0% {
    transform: translateX(0);
  }

  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);

    transform: translateX(0);
  }

  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);

    transform: translateX(83.67142%);
  }

  100% {
    transform: translateX(200.611057%);
  }
}

@keyframes indeterminate-scale_animation {
  0% {
    transform: scaleX(0.08);
  }

  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);

    transform: scaleX(0.08);
  }

  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);

    transform: scaleX(0.661479);
  }

  100% {
    transform: scaleX(0.08);
  }
}

@keyframes secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);

    transform: translateX(0);
  }

  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);

    transform: translateX(37.651913%);
  }

  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);

    transform: translateX(84.386165%);
  }

  100% {
    transform: translateX(160.277782%);
  }
}

@keyframes secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(
      0.205028,
      0.057051,
      0.57661,
      0.453971
    );

    transform: scaleX(0.08);
  }

  19.15% {
    animation-timing-function: cubic-bezier(
      0.152313,
      0.196432,
      0.648374,
      1.004315
    );

    transform: scaleX(0.457104);
  }

  44.15% {
    animation-timing-function: cubic-bezier(
      0.257759,
      -0.003163,
      0.211762,
      1.38179
    );

    transform: scaleX(0.72796);
  }

  100% {
    transform: scaleX(0.08);
  }
}
@keyframes stream {
  to {
    transform: translateX(8px);
  }
}
</style>
