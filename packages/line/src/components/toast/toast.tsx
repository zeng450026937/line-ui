import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { usePopup } from '@line-ui/line/src/mixins/use-popup';
import { usePopupDuration } from '@line-ui/line/src/mixins/use-popup-duration';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import { iosEnterAnimation } from '@line-ui/line/src/components/toast/animations/ios.enter';
import { iosLeaveAnimation } from '@line-ui/line/src/components/toast/animations/ios.leave';
import { mdEnterAnimation } from '@line-ui/line/src/components/toast/animations/md.enter';
import { mdLeaveAnimation } from '@line-ui/line/src/components/toast/animations/md.leave';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('toast');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ usePopup(),
    /*#__PURE__*/ usePopupDuration(),
    /*#__PURE__*/ useColor(),
  ],

  props : {
    /**
     * The position of the toast on the screen.
     */
    // top | bottom | middle
    position : String,
    message  : String,
  },

  beforeMount() {
    const { mode } = this;
    this.$on('animation-enter', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdEnterAnimation : iosEnterAnimation;
      animate(builder(baseEl, this.position));
    });
    this.$on('animation-leave', (baseEl: HTMLElement, animate: Function) => {
      const builder = mode === 'md' ? mdLeaveAnimation : iosLeaveAnimation;
      animate(builder(baseEl, this.position));
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
    const { position = 'bottom' } = this;
    return (
      <div
        v-show={this.visible}
        class={[bem()]}
        on={this.$listeners}
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
