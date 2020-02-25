import { useGroup } from '@/mixins/use-group';
import { createNamespace } from '@/utils/namespace';

const NAMESPACE = 'SwitchGroup';
const [createComponent, bem] = createNamespace('switch-group');

export default createComponent({
  extends : useGroup(NAMESPACE),

  render() {
    return (
      <div class="switch-group">
        {this.slots()}
      </div>
    );
  },

});
