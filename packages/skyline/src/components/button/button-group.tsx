import { createNamespace } from 'skyline/src/utils/namespace';
import { useGroup } from 'skyline/src/mixins/use-group';

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
