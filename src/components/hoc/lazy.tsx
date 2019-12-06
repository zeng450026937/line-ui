import { createNamespace } from '@/utils/namespace';
import { useLazy } from '@/mixins/use-lazy';

const [createComponent, bem] = createNamespace('lazy');

export default createComponent({
  mixins : [
    useLazy(),
  ],

  render() {
    return (
      <div class={bem()}>
        { this.slots() }
      </div>
    );
  },
});
