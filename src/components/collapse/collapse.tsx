import { createNamespace } from '@/utils/namespace';
import { useCheckGroup } from '@/mixins/use-check-group';
import '@/components/collapse/collapse.scss';

const NAMESPACE = 'Collapse';
const [createComponent, bem] = createNamespace('collapse');

export default createComponent({
  mixins : [useCheckGroup(NAMESPACE)],

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
