import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { Overlay } from '@/components/overlay';
import '@/components/popup/popup.scss';
import '@/components/popup/popup.ios.scss';
import { iosEnterAnimation } from '@/components/popup/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/popup/animations/ios.leave';
import { mdEnterAnimation } from '@/components/popup/animations/md.enter';
import { mdLeaveAnimation } from '@/components/popup/animations/md.leave';

const [createComponent, bem] = createNamespace('popup');

export default createComponent({
  mixins : [usePopup()],

  created() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = iosEnterAnimation;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
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
