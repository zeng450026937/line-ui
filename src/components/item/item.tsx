import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
// import '@/components/item/item.scss';
// import '@/components/item/item.ios.scss';

const [createComponent, bem] = createNamespace('item');

export default createComponent({
  mixins : [useColor()],

  render() {
    return (
      <div
        class={bem()}
      ></div>
    );
  },
});
