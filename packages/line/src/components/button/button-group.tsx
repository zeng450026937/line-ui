import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useGroup } from '@line-ui/line/src/mixins/use-group';

const NAMESPACE = 'ButtonGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('button-group');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useGroup(NAMESPACE),
  ],

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
