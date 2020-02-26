import { createNamespace } from '@/utils/namespace';
import { useCheckGroupWithModel } from '@/mixins/use-check-group';

const NAMESPACE = 'Tabs';
const [createComponent, bem] = createNamespace('tabs');

export default createComponent({
  mixins : [useCheckGroupWithModel(NAMESPACE)],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    return (
      <div
        class={bem()}
      >
        {this.slots('top')}
        <div
          class={bem('inner')}
        >
          {this.slots()}
        </div>
        {this.slots('bottom')}
      </div>
    );
  },

});
