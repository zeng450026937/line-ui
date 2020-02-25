import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/mixins/use-group';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button-group');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
