import { createNamespace } from 'skyline/utils/namespace';
import { config } from 'skyline/utils/config';
import { isPlatform } from 'skyline/utils/platform';
import { sanitizeDOMString } from 'skyline/utils/sanitization';
import { SPINNERS, SpinnerTypes } from 'skyline/components/spinner/spinner-configs';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('refresher-content');

export default /*#__PURE__*/ createComponent({

  props : {
    pullingIcon       : String,
    pullingText       : String,
    refreshingSpinner : String,
    refreshingText    : String,
  },

  data() {
    return {
      icon    : '',
      spinner : '',
    };
  },

  beforeMount() {
    this.icon = this.pullingIcon;
    this.spinner = this.refreshingSpinner;
  },

  mounted() {
    if (this.pullingIcon === undefined) {
      const { mode } = this;
      const overflowRefresher = ((this.$el as any).style as any).webkitOverflowScrolling !== undefined ? 'lines' : 'arrow-down';
      this.icon = config.get(
        'refreshingIcon',
        mode === 'ios' && isPlatform('mobile') ? config.get('spinner', overflowRefresher) : 'circular',
      );
    }
    if (this.refreshingSpinner === undefined) {
      const { mode } = this;
      this.spinner = config.get(
        'refreshingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'circular'),
      );
    }
  },

  render() {
    const {
      icon: pullingIcon, pullingText, spinner: refreshingSpinner, refreshingText, mode,
    } = this;
    const hasSpinner = pullingIcon != null && SPINNERS[pullingIcon] as any !== undefined;

    return (
      <div class={bem()}>
        <div class="refresher-pulling">
          {pullingIcon && hasSpinner
            && <div class="refresher-pulling-icon">
              <div class="spinner-arrow-container">
                <line-spinner type={pullingIcon as SpinnerTypes} paused></line-spinner>
                {mode === 'md' && pullingIcon === 'circular'
                  && <div class="arrow-container">
                    <line-icon name="caret-back-sharp"></line-icon>
                  </div>
                }
              </div>
            </div>
          }
          {pullingIcon && !hasSpinner
            && <div class="refresher-pulling-icon">
              <line-icon icon={pullingIcon} lazy={false}></line-icon>
            </div>
          }
          {pullingText
            && <div class="refresher-pulling-text" innerHTML={sanitizeDOMString(pullingText)}></div>
          }
        </div>
        <div class="refresher-refreshing">
          {refreshingSpinner
            && <div class="refresher-refreshing-icon">
              <line-spinner type={refreshingSpinner}></line-spinner>
            </div>
          }
          {refreshingText
            && <div class="refresher-refreshing-text" innerHTML={sanitizeDOMString(refreshingText)}></div>
          }
        </div>
      </div>
    );
  },

});
