import { createNamespace } from 'skyline/utils/namespace';
import { useLazy } from 'skyline/mixins/use-lazy';

const [createComponent, bem] = createNamespace('lazy');

export default /*#__PURE__*/ createComponent({
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
