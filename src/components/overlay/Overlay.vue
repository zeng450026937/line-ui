<script>
import Vue from 'vue';
import { createNamespace } from '@/utils/namespace';
import { GESTURE_CONTROLLER } from '@/utils/gesture';
import { now } from '@/utils/helpers';

const [createComponent, bem] = createNamespace('overlay');

export default createComponent({
  props : {
    visable : {
      type    : Boolean,
      default : true,
    },
    tappable : {
      type    : Boolean,
      default : true,
    },
    stopPropagation : {
      type    : Boolean,
      default : false,
    },
  },

  created() {
    this.lastClick = -10000;
    this.blocker = GESTURE_CONTROLLER.createBlocker({
      disableScroll : true,
    });

    if (this.stopPropagation) {
      this.blocker.block();
    }
  },

  beforeDestroy() {
    this.blocker.unblock();
  },

  methods : {
    onTouchStart(ev) {
      this.lastClick = now(ev);
      this.emitTap(ev);
    },

    onMouseDown(ev) {
      if (this.lastClick < now(ev) - 2500) {
        this.emitTap(ev);
      }
    },

    emitTap(ev) {
      if (this.stopPropagation) {
        ev.preventDefault();
        ev.stopPropagation();
      }
      if (this.tappable) {
        this.$emit('tap');
      }
    },
  },

  render() {
    return (
      <div tabindex="-1"
        class={bem({
          hide          : !this.visable,
          'no-tappable' : !this.tappable,
        })}
        on={{
          '!touchstart' : this.onTouchStart,
          '!click'      : this.onMouseDown,
          '!mousedown'  : this.onMouseDown,
        }}
      >
        {this.slots()}
      </div>
    );
  },
});

</script>

<style lang="scss">

$overlay-color: rgba(0, 0, 0, 0.5) !default;
$overlay-z-index: 2 !default;

.line {
  &-overlay {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    align-items: center;
    justify-content: center;

    transform: translateZ(0);

    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), z-index 1ms;
    // pointer-events: none;

    border-radius: inherit;

    background-color: $overlay-color;

    contain: strict;
    cursor: pointer;
    touch-action: none;
    z-index: $overlay-z-index;

    &--hide {
      background: transparent;
    }

    &--no-tappable {
      cursor: auto;
      pointer-events: none;
    }
  }
}

</style>
