import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/components/group';
import '@/components/collapse/collapse.scss';

const NAMESPACE = 'Collapse';
const [createComponent, bem] = createNamespace('collapse');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
