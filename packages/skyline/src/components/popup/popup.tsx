import { createNamespace } from 'skyline/utils/namespace';
import { usePopup } from 'skyline/mixins/use-popup';
import { Overlay } from 'skyline/components/overlay';
import { iosEnterAnimation } from 'skyline/components/popup/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/components/popup/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/components/popup/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/components/popup/animations/md.leave';

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
