import { createNamespace } from '@/utils/namespace';
import '@/components/toolbar/toolbar.scss';
import '@/components/toolbar/toolbar.ios.scss';

const [createComponent, bem] = createNamespace('toolbar');

export default createComponent({
  props : {
  },

  render() {
    return (
      <div
        class={bem()}
      >
        {this.slots('start')}
        {this.slots('end')}
      </div>
    );
  },
});
