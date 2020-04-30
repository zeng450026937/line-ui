<template>
  <div class="split-pane" v-dimension="onDimension">
    <div class="pane" :style="`${dimension}: ${clampedPos}%;`">
      <slot name="start"></slot>
    </div>

    <div class="pane" :style="`${dimension}: ${100 - clampedPos}%;`">
      <slot name="end"></slot>
    </div>

    <div
      v-if="!fixed"
      class="divider"
      :class="type"
      :style="`${side}: calc(${clampedPos}% - 8px`"
      v-drag="onDrag"
    ></div>

    <div v-if="dragging" class="mousecatcher"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    // horizontal | vertical
    type: {
      type: String,
      default: 'horizontal',
    },
    fixed: Boolean,
    buffer: {
      type: Number,
      default: 344,
    },
  },

  data() {
    return {
      w: 0,
      h: 0,
      pos: 75,
      dragging: false,
    };
  },

  computed: {
    size() {
      return this.type === 'vertical' ? this.h : this.w;
    },
    min() {
      return 100 * (this.buffer / this.size);
    },
    max() {
      return 100 - this.min;
    },
    side() {
      return this.type === 'horizontal' ? 'left' : 'top';
    },
    dimension() {
      return this.type === 'horizontal' ? 'width' : 'height';
    },

    clampedPos() {
      return Math.max(this.min, Math.min(this.pos, this.max));
    },
  },

  methods: {
    onDimension(el: Element) {
      this.w = el.clientWidth;
      this.h = el.clientHeight;
    },
    onDrag(dragging: true, ev: MouseEvent) {
      this.dragging = dragging;
      this.setPos(ev);
    },

    setPos(event: MouseEvent) {
      const { $el, type, size } = this;
      const container = $el as HTMLElement;
      const { top, left } = container.getBoundingClientRect();
      const px =
        type === 'vertical' ? event.clientY - top : event.clientX - left;
      this.pos = (100 * px) / size;
    },
  },
});
</script>

<style lang="scss" scoped>
.split-pane {
  position: relative;

  width: 100%;
  height: 100%;

  .pane {
    position: relative;

    width: 100%;
    height: 100%;

    float: left;

    overflow: auto;
  }

  .mousecatcher {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background: rgba(0, 0, 0, 0.01);

    z-index: 10;
  }

  .divider {
    display: none;
    position: absolute;

    z-index: 10;
  }

  .divider::after {
    position: absolute;

    background-color: #ababab;

    /* stylelint-disable-next-line */
    content: '';
  }

  .horizontal {
    width: 0;
    height: 100%;

    padding: 0 8px;

    cursor: ew-resize;
  }

  .horizontal::after {
    top: 0;
    left: 8px;

    width: 1px;
    height: 100%;
  }

  .vertical {
    width: 100%;
    height: 0;

    padding: 8px 0;

    cursor: ns-resize;
  }

  .vertical::after {
    top: 8px;
    left: 0;

    width: 100%;
    height: 1px;
  }

  .left,
  .right,
  .divider {
    display: block;
  }

  .left,
  .right {
    height: 100%;

    float: left;
  }

  .top,
  .bottom {
    position: absolute;

    width: 100%;
  }

  .top {
    top: 0;
  }
  .bottom {
    bottom: 0;
  }
}
</style>
