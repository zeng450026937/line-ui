import { createNamespace } from 'skyline/src/utils/namespace';
import { useLazy } from 'skyline/src/mixins/use-lazy';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('lazy');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useLazy(),
  ],

  render() {
    return (
      <div class={bem()}>
        { this.slots() }
      </div>
    );
  },
});
