<template>
  <div class="progress-circular"
    :class="classes"
    :style="styles"
    v-on="$listeners"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`${viewBoxSize} ${viewBoxSize} ${2 * viewBoxSize} ${2 * viewBoxSize}`"
    >
      <template v-for="index in 2">
        <circle
          v-if="!indeterminate || index === 2"
          :key="index"
          :class="index === 1 ? 'underlay' : 'overlay'"
          fill="transparent"
          :cx="2 * viewBoxSize"
          :cy="2 * viewBoxSize"
          :r="radius"
          :stroke-width="strokeWidth"
          :stroke-dasharray="strokeDashArray"
          :stroke-dashoffset="index === 1 ? 0 : strokeDashOffset"
        ></circle>
      </template>
    </svg>

    <div class="info">
      <slot>
        <span>{{value}}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { convertToUnit } from '@/utils/helpers';

export default Vue.extend({
  name : 'ProgressCircular',

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
    indeterminate : {
      type    : Boolean,
      default : false,
    },
    size : {
      type    : Number,
      default : 32,
    },
    width : {
      type    : [Number, String],
      default : 4,
    },
    rotate : {
      type    : [Number, String],
      default : 0,
    },
    color : {
      type    : String,
      default : '#10c29b',
    },
  },

  computed : {
    position(): number {
      let normalizedValue = this.value;
      const { from, to } = this;

      if (normalizedValue < from) {
        normalizedValue = from;
      }
      if (normalizedValue > to) {
        normalizedValue = to;
      }
      if (normalizedValue !== this.value) {
        this.$emit('change', normalizedValue);
      }
      return (normalizedValue - from) / (to - from);
    },

    strokeDashOffset(): string {
      return `${ (1 - this.position) * (this as any).circumference }px`;
    },

    strokeWidth(): number {
      return Number(this.width) / +this.size * this.viewBoxSize * 2;
    },

    classes(): object {
      return { 'is-indeterminate': this.indeterminate };
    },

    styles(): object {
      return {
        height        : convertToUnit(this.size),
        width         : convertToUnit(this.size),
        color         : this.color,
        'caret-color' : this.color,
      };
    },

    svgStyles(): object {
      return {
        transform : `rotate(${ Number(this.rotate) }deg)`,
      };
    },

    viewBoxSize(): number {
      return (this as any).radius / (1 - Number(this.width) / +this.size);
    },
  },

  created() {
    (this as any).radius = 20;
    (this as any).circumference = 2 * Math.PI * (this as any).radius;
    (this as any).strokeDashArray = Math.round((this as any).circumference * 1000) / 1000;
  },
});
</script>

<style lang="scss">

$progress-circular-rotate-animation: progress-circular-rotate 1.4s linear infinite !default;
$progress-circular-rotate-dash: progress-circular-dash 1.4s ease-in-out infinite !default;
$process-circular-intermediate-svg-transition: all .2s ease-in-out !default;
$progress-circular-underlay-stroke: rgba(#000000, 0.1) !default;
$progress-circular-overlay-transition: all .6s ease-in-out !default;

.progress-circular {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 100%;
    height: 100%;
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }

  .underlay {
    stroke: $progress-circular-underlay-stroke;
  }
  .overlay {
    stroke: currentColor;
    transition: $progress-circular-overlay-transition;
  }
  .info {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  &.is-indeterminate {
    svg {
      animation: $progress-circular-rotate-animation;
      transform-origin: center center;
      transition: $process-circular-intermediate-svg-transition;
    }

    .overlay {
      animation: $progress-circular-rotate-dash;
      stroke-linecap: round;
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0px;
    }
  }
}

@keyframes progress-circular-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0px;
  }

  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125px;
  }
}

@keyframes progress-circular-rotate {
  100% {
    transform: rotate(360deg)
  }
}

</style>
