import { createNamespace } from 'skyline/utils/namespace';
import { usePopup } from 'skyline/mixins/use-popup';
import { usePopupDuration } from 'skyline/mixins/use-popup-duration';
import { Overlay } from 'skyline/components/overlay';
import { Spinner } from 'skyline/components/spinner';
import { iosEnterAnimation } from 'skyline/components/loading/animations/ios.enter';
import { iosLeaveAnimation } from 'skyline/components/loading/animations/ios.leave';
import { mdEnterAnimation } from 'skyline/components/loading/animations/md.enter';
import { mdLeaveAnimation } from 'skyline/components/loading/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('loading');

export default /*#__PURE__*/ createComponent({
  mixins : [
    usePopup(),
    usePopupDuration(),
  ],

  props : {
    message : String,
    spinner : String,
  },

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
    const { message, spinner } = this;
    return (
      <div
        v-show={this.visible}
        role="dialog"
        aria-modal="true"
        class={bem({
          translucent : this.translucent,
        })}
        on={this.$listeners}
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
