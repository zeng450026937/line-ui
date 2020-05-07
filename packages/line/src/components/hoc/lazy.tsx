import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useLazy } from '@line-ui/line/src/mixins/use-lazy';

const { createComponent } = /*#__PURE__*/ createNamespace('lazy');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useLazy()],

  render() {
    return this.slots();
  },
});
