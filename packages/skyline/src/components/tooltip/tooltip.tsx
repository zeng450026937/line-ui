import Popper from 'popper.js';
import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { usePopup } from 'skyline/mixins/use-popup';
import { usePopupDuration } from 'skyline/mixins/use-popup-duration';
import { usePopupDelay } from 'skyline/mixins/use-popup-delay';
import { useTrigger } from 'skyline/mixins/use-trigger';
import { iosEnterAnimation } from 'skyline/components/tooltip/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/components/tooltip/animations/ios.leave';
import { createDirective } from 'skyline/utils/directive';
import vHover from 'skyline/directives/hover';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('tooltip');

export default /*#__PURE__*/ createComponent({
  mixins : [
    useColor(),
    usePopup({ disableScroll: false }),
    usePopupDuration(),
    usePopupDelay(),
    useTrigger(),
  ],

  props : {
    // This property holds the text shown on the tool tip.
    text      : String,
    placement : {
      type    : String,
      default : 'top',
    },
    activeFocus : {
      type    : Boolean,
      default : false,
    },
    openOnHover : Boolean,
  },

  watch : {
    openOnHover(val) {
      this.vHover.update(val && this.onHover);
    },
  },

  created() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = (baseEl: HTMLElement) => {
        const {
          $triggerEl = (this.event && this.event.target) || document.body,
          $el,
          placement,
        } = this;

        this.popper = new Popper(
          $triggerEl,
          $el,
          {
            placement     : placement as any,
            positionFixed : true,
            eventsEnabled : false,
          },
        );
        return iosEnterAnimation(baseEl);
      };
    });

    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
    });
  },

  async mounted() {
    await this.$nextTick();
    if (!this.$triggerEl) return;
    this.vHover = createDirective(vHover, this.$triggerEl, { name: 'hover' });
    this.vHover.inserted();
    if (this.openOnHover) {
      this.vHover.update(this.onHover);
    }
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
    if (this.vHover) {
      this.vHover.unbind();
    }
  },

  methods : {
    onHover(hover: boolean) {
      if (!this.openOnHover) return;
      this.visible = hover;
    },
  },

  render() {
    const { delayedVisible, text } = this;
    return (
      <div
        vShow={delayedVisible}
        role="tooltip"
        class={bem({ translucent: this.translucent })}
        on={this.$listeners}
      >
        <div class={bem('arrow')} x-arrow></div>
        <div class={bem('content')}>
          { this.slots() || text }
        </div>
      </div>
    );
  },
});
