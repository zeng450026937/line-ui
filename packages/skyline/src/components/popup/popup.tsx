import { createNamespace } from 'skyline/src/utils/namespace';
import { usePopup } from 'skyline/src/mixins/use-popup';
import { Overlay } from 'skyline/src/components/overlay';
import { iosEnterAnimation } from 'skyline/src/components/popup/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/src/components/popup/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/src/components/popup/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/src/components/popup/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('popup');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
  ],

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (builder: any) => {
      builder.build = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
    });
  },

  methods : {
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
        <Overlay
          onTap={this.onTap}
        >
        </Overlay>

        <div
          role="dialog"
          class={bem('wrapper')}
        >
          {this.slots()}
        </div>
      </div>
    );
  },
});
