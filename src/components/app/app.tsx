import { createNamespace } from '@/utils/namespace';
import { setupPlatforms, isPlatform } from '@/utils/platform';

const [createComponent, bem] = createNamespace('app');
const CONTENT_ELEMENT = 'content';

export default createComponent({
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

  created() {
    setupPlatforms();
  },

  render() {
    return (
      <div id={this.id} skyline-app class={bem()}>
        <div class={bem(CONTENT_ELEMENT)} ref="CONTENT_ELEMENT">
          {this.slots()}
        </div>
      </div>
    );
  },
});
