import { createNamespace } from '@/utils/namespace';
import { setupPlatforms, isPlatform } from '@/utils/platform';

const [createComponent, bem] = createNamespace('app');

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
        {this.slots()}
      </div>
    );
  },
});
