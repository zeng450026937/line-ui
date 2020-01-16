import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/card/card-content.scss';
import '@/components/card/card-content.ios.scss';

const [createComponent, bem] = createNamespace('card-content');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        class={bem()}
      >
        {this.slots()}
      </div>
    );
  },
});
