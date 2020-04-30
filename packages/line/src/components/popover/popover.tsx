import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { useTrigger } from '@line-ui/line/src/mixins/use-trigger';
import { Overlay } from '@line-ui/line/src/components/overlay';
import { iosEnterAnimation } from '@line-ui/line/src/components/popover/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/popover/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/popover/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/popover/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('popover');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ usePopup(), /*#__PURE__*/ useTrigger()],

  beforeMount() {
    const { mode } = this;

    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl, this.$triggerEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl));
    });
  },

  methods: {
    onTap() {
      this.$emit('overlay-tap');
    },
  },

  render() {
    return (
      <div
        v-show={this.visible}
        aria-modal="true"
        class={bem({ translucent: this.translucent })}
        on={this.$listeners}
      >
        <Overlay visible={this.dim} onTap={this.onTap}></Overlay>

        <div class={bem('wrapper')}>
          <div class={bem('arrow')}></div>
          <div class={bem('content')}>{this.slots()}</div>
        </div>
      </div>
    );
  },
});
