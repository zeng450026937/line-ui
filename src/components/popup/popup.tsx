import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { Overlay } from '@/components/overlay';
import { iosEnterAnimation } from '@/components/popup/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/popup/animations/ios.leave';
import { mdEnterAnimation } from '@/components/popup/animations/md.enter';
import { mdLeaveAnimation } from '@/components/popup/animations/md.leave';

const [createComponent, bem] = createNamespace('popup');

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
        role="dialog"
        class={bem()}
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
