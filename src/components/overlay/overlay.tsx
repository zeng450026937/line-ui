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
    dim : {
      type    : Boolean,
      default : false,
    },
    translucent : {
      type    : Boolean,
      default : false,
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
          'no-tappable' : this.visable && !this.tappable,
          dim           : this.visable && this.dim,
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
