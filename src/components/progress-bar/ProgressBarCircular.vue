<template>
  <div class="progress-bar-circular"
       :style="{ color: color || '#10c29b' }">
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="22 22 45 45"
         style="transform: rotate(0deg);">
      <circle fill="transparent"
              cx="45"
              cy="45"
              r="20"
              stroke-width="4"
              stroke-dasharray="126"
              stroke-dashoffset="0"
              stroke-linecap="round"
              class="circular__underlay">
      </circle>
      <circle fill="transparent"
              cx="45"
              cy="45"
              r="20"
              stroke-width="4"
              stroke-dasharray="126"
              :stroke-dashoffset="`${(1 - position) * 126}px`"
              stroke-linecap="round"
              class="circular__overlay">
      </circle>
    </svg>
    <span class="progress-bar-circular__info">
      {{position * 100}}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ProgressBarCircular',

  props: {
    from: {
      type: Number,
      default: 0,
    },
    to: {
      type: Number,
      default: 100,
    },
    color: {
      type: String,
      default: '#10c29b',
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    position() {
      if (this.indeterminate) {
        return 0.1;
      }
      let { value, to, from } = this;

      if (to < from) {
        to = 100;
        from = 0;
        console.warn('to', this.to);
        console.warn('from', this.from);
      }

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

  watch: {

  },
};
</script>

<style lang="scss">
.progress-bar-circular {
  width: 120px;
  height: 120px;
  margin: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    top: 0;
    bottom: 0;
  }
  .circular__underlay {
    stroke: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  .circular__overlay {
    stroke: currentColor;
    z-index: 2;
    transition: all 0.4s ease-in-out;
  }
  .progress-bar-circular__info {
    font-size: 14px;
  }
}
</style>
