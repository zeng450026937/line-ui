import { createNamespace } from 'skyline/utils/namespace';
import { setupPlatforms } from 'skyline/utils/platform';
import { setupConfig } from 'skyline/utils/config';
import { setupTapClick } from 'skyline/utils/tap-click';
import { setupFocusVisible } from 'skyline/utils/focus-visible';
import { setupPopup } from 'skyline/utils/popup';

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

  beforeCreate() {
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
