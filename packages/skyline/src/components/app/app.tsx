import { createNamespace } from 'skyline/src/utils/namespace';
import { setupPlatforms } from 'skyline/src/utils/platform';
import { setupConfig } from 'skyline/src/utils/config';
import { setupTapClick } from 'skyline/src/utils/tap-click';
import { setupFocusVisible } from 'skyline/src/utils/focus-visible';
import { setupPopup } from 'skyline/src/utils/popup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('app');

export default /*#__PURE__*/ createComponent({
  props : {
    id : {
      type    : String,
      default : 'app',
    },
  },

  provide() {
    return {
      App : this,
    };
  },

  beforeMount() {
    // TODO:
    // config must be setup before using
    // while child content is rendered before created
    setupConfig();
    setupPlatforms();
    setupTapClick();
    setupFocusVisible();
    setupPopup();
  },

  render() {
    return (
      <div id={this.id} skyline-app class={[bem(), 'line-page']}>
        {this.slots()}
      </div>
    );
  },
});
