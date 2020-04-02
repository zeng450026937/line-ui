import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { usePopupDuration } from '@line-ui/line/src/mixins/use-popup-duration';
import { Overlay } from '@line-ui/line/src/components/overlay';
import { Spinner } from '@line-ui/line/src/components/spinner';
import { iosEnterAnimation } from '@line-ui/line/src/components/loading/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/loading/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/loading/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/loading/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('loading');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
    /*#__PURE__*/ usePopupDuration(),
  ],

  props : {
    message : String,
    spinner : String,
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl));
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
