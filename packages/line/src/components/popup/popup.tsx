import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { Overlay } from '@line-ui/line/src/components/overlay';
import { iosEnterAnimation } from '@line-ui/line/src/components/popup/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/popup/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/popup/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/popup/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('popup');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ usePopup()],

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl));
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
        role="dialog"
        class={bem()}
        on={this.$listeners}
      >
        <Overlay onTap={this.onTap}></Overlay>

        <div role="dialog" class={bem('wrapper')}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
