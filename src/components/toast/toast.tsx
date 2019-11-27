import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import '@/components/toast/toast.scss';
import '@/components/toast/toast.ios.scss';
import { iosEnterAnimation } from '@/components/toast/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/toast/animations/ios.leave';
import { mdEnterAnimation } from '@/components/toast/animations/md.enter';
import { mdLeaveAnimation } from '@/components/toast/animations/md.leave';

const [createComponent, bem] = createNamespace('toast');

export default createComponent({
  mixins : [usePopup()],

  props : {
    color : String,

    duration : Number,
    /**
     * The position of the toast on the screen.
     */
    // top | bottom | middle
    position : String,

    message : String,
  },

  created() {
    this.$on('animation:enter', (builder: any) => {
      builder.build = iosEnterAnimation;
    });
    this.$on('animation:leave', (builder: any) => {
      builder.build = iosLeaveAnimation;
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
    return (
      <div
        v-show={this.visible}
        class={[bem()]}
      >
        <div
          class={bem('wrapper', { bottom: true })}
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
