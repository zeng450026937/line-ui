<template>
  <main class="application-window">
    <div class="background"
      v-if="$scopedSlots.background"
    >
      <slot name="background"></slot>
    </div>

    <div class="menubar"
      v-if="$scopedSlots.menubar"
    >
      <slot name="menubar"></slot>
    </div>

    <div class="header"
      v-if="$scopedSlots.header"
    >
      <slot name="header"></slot>
    </div>

    <div class="content"
      v-if="$scopedSlots.default"
    >
      <slot></slot>
    </div>

    <div class="footer"
      v-if="$scopedSlots.footer"
    >
      <slot name="footer"></slot>
    </div>

    <div class="overlay" ref="overlay"></div>
  </main>
</template>

<script>
import Window from '@/mixins/window';

export default {
  name: 'ApplicationWindow',

  extends: Window,

  provide() {
    return {
      ApplicationWindow: this,
      Overlay: null,
    };
  },

  mounted() {
    console.log(this);
  },
};
</script>

<style lang="scss">

.application-window {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > .background,
  > .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  > .menubar,
  > .header,
  > .footer {
    position: relative;
    flex-shrink: 1;
  }

  > .content {
    position: relative;
    flex-grow: 1;
  }
}

</style>
