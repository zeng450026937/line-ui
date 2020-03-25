import { createNamespace } from 'skyline/src/utils/namespace';
import { setupPlatforms } from 'skyline/src/utils/platform';
import { setupConfig } from 'skyline/src/utils/config';
import { setupTapClick } from 'skyline/src/utils/tap-click';
import { setupFocusVisible } from 'skyline/src/utils/focus-visible';
import { setupPopup } from 'skyline/src/utils/popup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('app');

let initialized: boolean | undefined;

export default /*#__PURE__*/ createComponent({
  props : {
    id : String,
  },

  provide() {
    return {
      App : this,
    };
  },

  beforeMount() {
    // Avoid multiple initialization
    if (initialized) return;
    // TODO:
    // config must be setup before using
    // while child content is rendered before created
    setupConfig();
    setupPlatforms();
    setupTapClick();
    setupFocusVisible();
    setupPopup();

    initialized = true;
  },

  render() {
    const { id = 'app' } = this;
    return (
      <div
        id={id}
        skyline-app
        class={[bem(), 'line-page']}
        on={this.$listeners}
       >
        {this.slots()}
      </div>
    );
  },
});
