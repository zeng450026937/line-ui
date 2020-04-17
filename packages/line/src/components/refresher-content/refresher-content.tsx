import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { config } from '@line-ui/line/src/utils/config';
import { isPlatform } from '@line-ui/line/src/utils/platform';
import { sanitizeDOMString } from '@line-ui/line/src/utils/sanitization';
import { Spinner } from '@line-ui/line/src/components/spinner';
import {
  SPINNERS,
  SpinnerTypes,
} from '@line-ui/line/src/components/spinner/spinner-configs';
import { Icon } from '@line-ui/line/src/components/icon';

const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'refresher-content'
);

export default /*#__PURE__*/ createComponent({
  props: {
    pullingIcon: String,
    pullingText: String,
    refreshingSpinner: String,
    refreshingText: String,
  },

  data() {
    return {
      icon: '',
      spinner: '',
    };
  },

  beforeMount() {
    this.icon = this.pullingIcon;
    this.spinner = this.refreshingSpinner;
  },

  mounted() {
    if (this.pullingIcon === undefined) {
      const { mode } = this;
      const overflowRefresher =
        ((this.$el as any).style as any).webkitOverflowScrolling !== undefined
          ? 'lines'
          : 'arrow-down';
      this.icon = config.get(
        'refreshingIcon',
        mode === 'ios' && isPlatform('mobile')
          ? config.get('spinner', overflowRefresher)
          : 'circular'
      );
    }
    if (this.refreshingSpinner === undefined) {
      const { mode } = this;
      this.spinner = config.get(
        'refreshingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'circular')
      );
    }
  },

  render() {
    const {
      icon: pullingIcon,
      pullingText,
      spinner: refreshingSpinner,
      refreshingText,
      mode,
    } = this;
    const hasSpinner =
      pullingIcon != null && (SPINNERS[pullingIcon] as any) !== undefined;

    return (
      <div class={bem()}>
        <div class="refresher-pulling">
          {pullingIcon && hasSpinner && (
            <div class="refresher-pulling-icon">
              <div class="spinner-arrow-container">
                <Spinner type={pullingIcon as SpinnerTypes} paused></Spinner>
                {mode === 'md' && pullingIcon === 'circular' && (
                  <div class="arrow-container">
                    <Icon name="caret-back-sharp"></Icon>
                  </div>
                )}
              </div>
            </div>
          )}
          {pullingIcon && !hasSpinner && (
            <div class="refresher-pulling-icon">
              <Icon icon={pullingIcon} lazy={false}></Icon>
            </div>
          )}
          {pullingText && (
            <div
              class="refresher-pulling-text"
              innerHTML={sanitizeDOMString(pullingText)}
            ></div>
          )}
        </div>
        <div class="refresher-refreshing">
          {refreshingSpinner && (
            <div class="refresher-refreshing-icon">
              <Spinner type={refreshingSpinner}></Spinner>
            </div>
          )}
          {refreshingText && (
            <div
              class="refresher-refreshing-text"
              innerHTML={sanitizeDOMString(refreshingText)}
            ></div>
          )}
        </div>
      </div>
    );
  },
});
