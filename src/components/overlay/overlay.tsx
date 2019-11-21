import { createNamespace } from '@/utils/namespace';
import { useLazy } from '@/mixins/use-lazy';
import { useTransition } from '@/mixins/use-transition';
import { GESTURE_CONTROLLER } from '@/utils/gesture';
import { now } from '@/utils/helpers';
import '@/components/overlay/overlay.scss';

const [createComponent, bem] = createNamespace('overlay');

export default createComponent({
  mixins : [useLazy(), useTransition()],

  props : {
    visible : {
      type    : Boolean,
      default : true,
    },
    tappable : {
      type    : Boolean,
      default : true,
    },
    stopPropagation : {
      type    : Boolean,
      default : true,
    },
    zIndex : {
      type    : [Number, String],
      default : 2000,
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
      this.emitTap(ev);
    },

    onMouseDown(ev: UIEvent) {
      if (this.lastClick < now(ev) - 1500) {
        this.emitTap(ev);
      }
    },

    emitTap(ev: UIEvent) {
      this.lastClick = now(ev);

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
        v-show={!!this.value}
        class={bem({
          hide     : !this.visible,
          tappable : this.tappable,
        })}
        style={{
          zIndex : this.zIndex,
        }}
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
