import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/card/card-title.scss';
import '@/components/card/card-title.ios.scss';

const [createComponent, bem] = createNamespace('card-title');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        role="heading"
        aria-level="2"
        class={[bem(), 'line-inherit-color']}
      >
        {this.slots()}
      </div>
    );
  },
});
