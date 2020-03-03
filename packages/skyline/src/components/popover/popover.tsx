import { createNamespace } from 'skyline/utils/namespace';
import { usePopup } from 'skyline/mixins/use-popup';
import { Overlay } from 'skyline/components/overlay';
import { iosEnterAnimation } from 'skyline/components/popover/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/components/popover/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/components/popover/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/components/popover/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('popover');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
  ],

  created() {
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
        class={bem({ translucent: this.translucent })}
        on={this.$listeners}
      >
        <Overlay
          visible={this.dim}
          onTap={this.onTap}
        >
        </Overlay>

        <div class={bem('wrapper')}>
          <div class={bem('arrow')}></div>
          <div class={bem('content')}>
            {this.slots()}
          </div>
        </div>
      </div>
    );
  },
});
