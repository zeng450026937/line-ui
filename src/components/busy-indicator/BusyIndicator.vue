<template>
  <div class="busy-indicator"
       :class="{ 'busy-indicator--running': running }">
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="22.5 22.5 45 45"
         style="transform: rotate(0deg);">
      <circle fill="transparent"
              cx="45"
              cy="45"
              r="20"
              stroke-width="4"
              stroke-dasharray="125.664"
              stroke-dashoffset="94.248px"
              class="busy-indicator__bar">
      </circle>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BusyIndicator',

  props: {
    running: {
      type: Boolean,
      default: false,
    },
  },

  methods: {},
});
</script>

<style lang="scss">
.busy-indicator {
  width: 32px;
  height: 32px;
  color: #000000;

  &__bar {
    stroke: currentColor;
  }
}
.busy-indicator--running {
  animation-name: busy-indicator_animation;
  animation-duration: 0.6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes busy-indicator_animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
