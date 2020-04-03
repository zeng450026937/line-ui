import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { usePopupDuration } from '@line-ui/line/src/mixins/use-popup-duration';
import { usePopupDelay } from '@line-ui/line/src/mixins/use-popup-delay';
import { useTrigger } from '@line-ui/line/src/mixins/use-trigger';
import { iosEnterAnimation } from '@line-ui/line/src/components/tooltip/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/tooltip/animations/ios.leave';
import { createDirective } from '@line-ui/line/src/utils/directive';
import { createPopper } from '@line-ui/line/src/utils/popper';
import { vHover } from '@line-ui/line/src/directives/hover';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('tooltip');

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ useColor(),
    /*#__PURE__*/ usePopup({ disableScroll: false }),
    /*#__PURE__*/ usePopupDuration(),
    /*#__PURE__*/ usePopupDelay(),
    /*#__PURE__*/ useTrigger(),
  ],

  props: {
    // This property holds the text shown on the tool tip.
    text: String,
    placement: {
      type: String,
      default: 'top',
    },
    openOnHover: {
      type: Boolean,
      default: true,
    },
  },

  watch: {
    trigger: 'createDirective',
    placement(val) {
      if (this.popper) {
        this.popper.setOptions({ placement: val });
      }
    },
  },

  beforeMount() {
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      this.createPopper();
      this.popper.update();
      animate(iosEnterAnimation(baseEl));
    });

    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      animate(iosLeaveAnimation(baseEl));
    });
  },

  async mounted() {
    await this.$nextTick();
    this.createDirective();
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
    }
    if (this.vHover) {
      this.vHover.unbind();
    }
  },

  methods: {
    createDirective() {
      if (this.vHover) {
        this.vHover.unbind();
      }

      if (!this.$triggerEl) return;

      this.vHover = createDirective(vHover, this.$triggerEl, { name: 'hover' });
      this.vHover.inserted(this.onHover);
    },
    createPopper() {
      if (this.popper) return;

      const getBoundingClientRect = () =>
        this.$triggerEl.getBoundingClientRect();
      const $trigger = { getBoundingClientRect };
      const { $el, placement } = this as any;
      const offset = 10;

      this.popper = createPopper($trigger, $el, {
        placement,
        strategy: 'fixed',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, offset],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true, // false by default
              padding: offset,
            },
          },
          {
            name: 'flip',
            options: {
              padding: offset,
            },
          },
        ],
      });
    },

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
        <div class={bem('arrow')} data-popper-arrow></div>
        <div class={bem('content')}>{this.slots() || text}</div>
      </div>
    );
  },
});
