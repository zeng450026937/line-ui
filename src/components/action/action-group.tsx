
import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/mixins/use-group';

const NAMESPACE = 'ActionGroup';
const [createComponent, bem] = createNamespace('action-group');

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