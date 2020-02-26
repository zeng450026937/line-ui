import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { Overlay } from '@/components/overlay';
import { iosEnterAnimation } from '@/components/popover/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/popover/animations/ios.leave';
import { mdEnterAnimation } from '@/components/popover/animations/md.enter';
import { mdLeaveAnimation } from '@/components/popover/animations/md.leave';

const [createComponent, bem] = createNamespace('popover');

export default createComponent({
  mixins : [usePopup()],

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
