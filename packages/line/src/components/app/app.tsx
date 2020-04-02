import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useBreakPoint } from '@line-ui/line/src/mixins/use-breakpoint';
import { setupPlatforms } from '@line-ui/line/src/utils/platform';
import { setupConfig } from '@line-ui/line/src/utils/config';
import { setupTapClick } from '@line-ui/line/src/utils/tap-click';
import { setupFocusVisible } from '@line-ui/line/src/utils/focus-visible';
import { setupPopup } from '@line-ui/line/src/utils/popup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('app');

let initialized: boolean | undefined;

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useBreakPoint(),
  ],

  props : {
    id : String,
  },

  provide() {
    return {
      App : this,
    };
  },

  beforeCreate() {
    // config must be setup before using
    // while child content is rendered before created
    setupConfig();
  },

  beforeMount() {
    // Avoid multiple initialization
    if (initialized) return;

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
        line-app
        class={[bem(), 'line-page']}
        on={this.$listeners}
      >
        {this.slots('header')}
        {this.slots()}
        {this.slots('footer')}
      </div>
    );
  },
});
