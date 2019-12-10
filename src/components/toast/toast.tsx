import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { usePopupDuration } from '@/mixins/use-popup-duration';
import { useColor } from '@/mixins/use-color';
import '@/components/toast/toast.scss';
import '@/components/toast/toast.ios.scss';
import { iosEnterAnimation } from '@/components/toast/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/toast/animations/ios.leave';
import { mdEnterAnimation } from '@/components/toast/animations/md.enter';
import { mdLeaveAnimation } from '@/components/toast/animations/md.leave';

const [createComponent, bem] = createNamespace('toast');

export default createComponent({
  mixins : [
    usePopup(),
    usePopupDuration(),
    useColor(),
  ],

  props : {
    /**
     * The position of the toast on the screen.
     */
    // top | bottom | middle
    position : String,
    message  : String,
  },

  created() {
    this.$on('animation-enter', (builder: any) => {
      builder.build = iosEnterAnimation;
      builder.options = this.position;
    });
    this.$on('animation-leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
      builder.options = this.position;
    });

    this.$on('opened', () => {
      if (this.duration > 0) {
        this.durationTimeout = setTimeout(() => this.close('timeout'), this.duration);
      }
    });
    this.$on('aboutToHide', () => {
      if (this.durationTimeout) {
        clearTimeout(this.durationTimeout);
      }
    });
  },

  render() {
    const { position } = this;
    return (
      <div
        v-show={this.visible}
        class={[bem()]}
      >
        <div
          class={bem('wrapper', { [position]: true })}
        >
          <div
            class={bem('container')}
          >
            {}

            <div
              class={bem('content')}
            >
              <div class={bem('message')}>
                {this.message}
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
