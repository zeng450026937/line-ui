// import { getSkylineMode } from '@/utils/config';
import { createColorClasses, useColor } from '@/mixins/use-color';
import { createNamespace } from '@/utils/namespace';
import '@/components/badge/badge.scss';
import '@/components/badge/badge.ios.scss';

// const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];
const [createComponent, bem] = createNamespace('badge');

export default createComponent({
  mixins : [useColor()],

  props : {

  },

  render() {
    // const mode = getSkylineMode(this);
    const { color } = this;

    return (
      <div
        class={[bem(), { ...createColorClasses(color) }]}
      >
        {this.slots()}
      </div>
    );
  },

});
