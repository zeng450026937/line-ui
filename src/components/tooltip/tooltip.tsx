import Popper from 'popper.js';
import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import { usePopup } from '@/mixins/use-popup';
import { usePopupDuration } from '@/mixins/use-popup-duration';
import { usePopupDelay } from '@/mixins/use-popup-delay';
import { useTrigger } from '@/mixins/use-trigger';
import { isDef } from '@/utils/helpers';
import '@/components/tooltip/tooltip.scss';
import { iosEnterAnimation } from '@/components/tooltip/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/tooltip/animations/ios.leave';

const [createComponent, bem] = createNamespace('tooltip');

export type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export default createComponent({
  mixins : [
    useColor(),
    usePopup(),
    usePopupDuration(),
    usePopupDelay(),
    useTrigger('visible'),
  ],

  props : {
    // This property holds the text shown on the tool tip.
    text      : String,
    placement : {
      type    : String,
      default : 'top',
    },
    arrow : {
      type    : Boolean,
      default : true,
    },
    activeFocus : {
      type    : Boolean,
      default : false,
    },
  },
  /*
  watch : {
    async visible(val) {
      if (!val) return;

      await this.$nextTick();

      const {
        $triggerEl = document.body,
        $el,
        placement,
        arrow,
      } = this;

      this.popper = new Popper(
        $triggerEl,
        $el,
        {
          placement     : placement as any,
          positionFixed : true,
          eventsEnabled : false,
          modifiers     : {
            arrow : {
              enabled : arrow,
            },
            computeStyle : {
              // TODO
              // use gpuAcceleration will cause animation work failed
              // while don't use gpuAcceleration may impact scroll perf.
              gpuAcceleration : false,
            },
          },
        },
      );
    },
  },
*/
  created() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = (baseEl: HTMLElement) => {
        const {
          $triggerEl = document.body,
          $el,
          placement,
          arrow,
        } = this;

        this.popper = new Popper(
          $triggerEl,
          $el,
          {
            placement     : placement as any,
            positionFixed : true,
            eventsEnabled : false,
            modifiers     : {
              arrow : {
                enabled : arrow,
              },
              computeStyle : {
              // TODO
              // use gpuAcceleration will cause animation work failed
              // while don't use gpuAcceleration may impact scroll perf.
                gpuAcceleration : false,
              },
            },
          },
        );
        return iosEnterAnimation(baseEl);
      };
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
    });
  },

  updated() {
    if (this.popper) {
      this.popper.scheduleUpdate();
    }
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
    }
  },

  methods : {
    hide() {
      this.close();
    },
    show() {
      this.open();
    },
  },

  render() {
    const { delayedVisible, text } = this;
    return (
      <div
        vShow={delayedVisible}
        role="tooltip"
        class={bem()}
      >
        <div class={bem('arrow')} x-arrow></div>
        <div class={bem('content')}>
          { this.slots() || text }
        </div>
      </div>
    );
  },
});
