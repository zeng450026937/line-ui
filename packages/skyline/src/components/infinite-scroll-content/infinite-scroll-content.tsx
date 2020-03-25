import { createNamespace } from 'skyline/src/utils/namespace';
import { config } from 'skyline/src/utils/config';
import { SpinnerTypes } from 'skyline/src/components/spinner/spinner-configs';
import { sanitizeDOMString } from 'skyline/src/utils/sanitization';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('infinite-scroll-content');

export default /*#__PURE__*/ createComponent({
  props : {
    loadingSpinner : {
      type : String,
    },
    loadingText : {
      type    : String,
      default : '',
    },
  },

  beforeMount() {
    let spinner = this.loadingSpinner as SpinnerTypes;

    if (spinner === undefined) {
      const { mode } = this;
      spinner = config.get(
        'infiniteLoadingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'crescent'),
      );
    }
  },

  render() {
    const { mode, loadingText, loadingSpinner } = this;

    return (
      <div
        class={[
          bem(),
          {
            // Used internally for styling
            [`line-infinite-scroll-content-${ mode }`] : true,
          },
        ]}
      >
        <div class="infinite-loading">
          {loadingSpinner && (
            <div class="infinite-loading-spinner">
              <line-spinner name={loadingSpinner} />
            </div>
          )}
          {loadingText && (
            <div class="infinite-loading-text" innerHTML={sanitizeDOMString(loadingText)} />
          )}
        </div>
      </div>
    );
  },
});
