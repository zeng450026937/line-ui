import { createNamespace } from '@/utils/namespace';
import { GESTURE_CONTROLLER } from '@/utils/gesture';
import { now } from '@/utils/helpers';
import { EventHandler, ScopedSlot } from '@/utils/types';

const [createComponent, bem] = createNamespace('overlay');

export type OverlayEvents = {
  onTap?: EventHandler;
};

export type OverlaySlots = {
  content?: ScopedSlot;
};

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

  events : {} as OverlayEvents,

  slots : {} as OverlaySlots,

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
    onTouchStart(ev: UIEvent) {
      this.lastClick = now(ev);
      this.emitTap(ev);
    },

    onMouseDown(ev: UIEvent) {
      if (this.lastClick < now(ev) - 2500) {
        this.emitTap(ev);
      }
    },

    emitTap(ev: UIEvent) {
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
