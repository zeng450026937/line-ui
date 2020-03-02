import { createNamespace } from 'skyline/utils/namespace';
import { useGroup } from 'skyline/mixins/use-group';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button-group');

export default /*#__PURE__*/ createComponent({
  mixins : [useGroup(NAMESPACE)],

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
