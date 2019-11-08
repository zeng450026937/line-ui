<template functional>
  <div class="busy-indicator"
       :class="{'is-running': props.running}">
    <slot name="content"
          v-bind={running:props.running}>
      busy~
    </slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name : 'BusyIndicator',

  components : {},

  props : {
    running : {
      type    : Boolean,
      default : false,
    },
  },
});
</script>

<style lang="scss">
.busy-indicator {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.is-running {
    animation-name: busy-indicator-animation;
    animation-duration: 0.6s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
}

@keyframes busy-indicator-animation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
