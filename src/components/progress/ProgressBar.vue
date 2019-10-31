<template>
  <div class="progress-bar">
    <template v-if="indeterminate">
      <div class="progress__wrap--indeterminate">
        <span class="progress-indeterminate-bar"
              :style="{ backgroundColor: color }"></span>
      </div>
      <div class="progress__wrap--indeterminate">
        <span class="progress-indeterminate-bar"
              :style="{ backgroundColor: color }"></span>
      </div>
    </template>
    <div v-else
         class="progress"
         :style="{ backgroundColor: color, transform: `scaleX(${position})` }">
    </div>
    <div class="progress-buffer-bar"
         :style="{ backgroundColor: `${this.color}20` }">

    </div>
  </div>
</template>

<script lang="ts">
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
    position() {
      if (this.indeterminate) {
        return 0;
      }
      let { value } = this;

      if (value > this.to) {
        value = this.to;
        console.warn('value', this.value);
      } else if (value < this.from) {
        value = this.from;
        console.warn('value', this.value);
      }
      const position = (value - this.from) / (this.to - this.from);

      return position;
    },
  },

  watch: {},
});
</script>

<style lang="scss">
.progress-bar {
  height: 5px;
  margin: 3px 0;
  position: relative;
  overflow: hidden;

  .progress {
    width: 100%;
    height: 100%;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    transform-origin: left top;
    transition: transform 0.4s linear 0s;
  }
  .progress-buffer-bar {
    width: 100%;
    height: 100%;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
  }

  .progress__wrap--indeterminate {
    width: 100%;
    height: 100%;
    left: -130%; // -145.166611%;
    right: 0px;
    top: 0px;
    bottom: 0px;
    position: absolute;
    transform-origin: left top;
    animation-name: indeterminate-translate_animation;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    .progress-indeterminate-bar {
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
  .progress__wrap--indeterminate:nth-of-type(2) {
    top: 0;
    right: 0;
    bottom: 0;
    left: -54.888891%;

    animation: secondary-indeterminate-translate 2s infinite linear;

    .progress-indeterminate-bar {
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
</style>
