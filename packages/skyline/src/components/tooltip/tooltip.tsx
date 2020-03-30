import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { usePopupDuration } from 'skyline/src/mixins/use-popup-duration';
import { usePopupDelay } from 'skyline/src/mixins/use-popup-delay';
import { useTrigger } from 'skyline/src/mixins/use-trigger';
import { iosEnterAnimation } from 'skyline/src/components/tooltip/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/tooltip/animations/ios.leave';
import { createDirective } from 'skyline/src/utils/directive';
import { createPopper } from 'skyline/src/utils/popper';
import { vHover } from 'skyline/src/directives/hover';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('tooltip');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
    /*#__PURE__*/ usePopup({ disableScroll: false }),
    /*#__PURE__*/ usePopupDuration(),
    /*#__PURE__*/ usePopupDelay(),
    /*#__PURE__*/ useTrigger(),
  ],

  props : {
    // This property holds the text shown on the tool tip.
    text      : String,
    placement : {
      type    : String,
      default : 'top',
    },
    activeFocus : Boolean,
    openOnHover : {
      type    : Boolean,
      default : false,
    },
    openOnClick : Boolean,
  },

  beforeMount() {
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const {
        $triggerEl = (this.event && this.event.target) || document.body,
        $el,
        placement,
      } = this;

      this.popper = this.popper || createPopper(
        $triggerEl,
        $el as HTMLElement,
        {
          placement : placement as any,
          strategy  : 'fixed',
          modifiers : [
            {
              name    : 'offset',
              options : {
                offset : [0, 10],
              },
            },
            {
              name    : 'flip',
              options : {
                rootBoundary : 'body',
              },
            },
          ],
        },
      );

      animate(iosEnterAnimation(baseEl));
    });

    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      animate(iosLeaveAnimation(baseEl));
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
    // if (this.popper) {
    //   this.popper.update();
    // }
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
