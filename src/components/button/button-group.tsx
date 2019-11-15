
import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/components/group';
import '@/components/button/button-group.scss';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button-group');

export default createComponent({
  extends : useGroup(NAMESPACE),

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
