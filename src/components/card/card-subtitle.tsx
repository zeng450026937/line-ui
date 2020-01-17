import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/card/card-subtitle.scss';
import '@/components/card/card-subtitle.ios.scss';

const [createComponent, bem] = createNamespace('card-subtitle');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        role="heading"
        aria-level="3"
        class={[bem(), 'line-inherit-color']}
      >
        {this.slots()}
      </div>
    );
  },
});