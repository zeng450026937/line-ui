import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { config } from '@line-ui/line/src/utils/config';
import { SpinnerTypes } from '@line-ui/line/src/components/spinner/spinner-configs';

const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'infinite-scroll-content'
);

export default /*#__PURE__*/ createComponent({
  props: {
    loadingSpinner: String,
    loadingText: String,
  },

  data() {
    return {
      spinner: '',
    };
  },

  beforeMount() {
    let spinner = this.loadingSpinner as SpinnerTypes;

    if (spinner === undefined) {
      const { mode } = this;
      spinner = config.get(
        'infiniteLoadingSpinner',
        config.get('spinner', mode === 'ios' ? 'lines' : 'crescent')
      );
    }

    this.spinner = spinner;
  },

  render() {
    const { mode, loadingText, spinner } = this;

    return (
      <div
        class={[
          bem(),
          // Used internally for styling
          `line-infinite-scroll-content-${mode}`,
        ]}
      >
        <div class="infinite-loading">
          {spinner && (
            <div class="infinite-loading-spinner">
              <line-spinner type={spinner} />
            </div>
          )}
          {loadingText && (
            <div class="infinite-loading-text">{loadingText}</div>
          )}
        </div>
      </div>
    );
  },
});
