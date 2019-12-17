import { getSkylineMode } from '@/utils/config';
import { createNamespace } from '@/utils/namespace';
import '@/components/badge/badge.scss';
import '@/components/badge/badge.ios.scss';

const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];
const [createComponent, bem] = createNamespace('badge');

export default createComponent({
  props : {
    color : {
      type    : String,
      default : 'danger', // primary, success, warning, danger, light, dark
    },
  },

  render() {
    const mode = getSkylineMode(this);

    return (
      <div
        class={[
          bem(),
          { [mode]: true },
        ]}
      >
        {this.slots()}
      </div>
    );
  },

});
