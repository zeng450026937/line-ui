import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import { Overlay } from '@/components/overlay';
import { Spinner } from '@/components/spinner';
import '@/components/loading/loading.scss';
import '@/components/loading/loading.ios.scss';
import { iosEnterAnimation } from '@/components/loading/animations/ios.enter';
import { iosLeaveAnimation } from '@/components/loading/animations/ios.leave';
import { mdEnterAnimation } from '@/components/loading/animations/md.enter';
import { mdLeaveAnimation } from '@/components/loading/animations/md.leave';

const [createComponent, bem] = createNamespace('loading');

export default createComponent({
  mixins : [usePopup()],

  props : {
    message  : String,
    duration : Number,
    spinner  : String,
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

  methods : {
    onTap() {
      this.$emit('overlay:tap');
    },
  },

  render() {
    const { message, spinner } = this;
    return (
      <div
        v-show={this.visible}
        role="dialog"
        aria-modal="true"
        class={bem({
          translucent : this.translucent,
        })}
      >
        <Overlay
          visible={this.dim}
          onTap={this.onTap}
        >
        </Overlay>

        <div
          role="dialog"
          class={bem('wrapper')}
        >
          {
            spinner && (
              <div class={bem('spinner')}>
                <Spinner type={spinner} />
              </div>
            )
          }

          {
            message && (
              <div class={bem('content')}>{message}</div>
            )
          }
        </div>
      </div>
    );
  },
});
