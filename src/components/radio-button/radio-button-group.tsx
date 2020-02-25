import { createNamespace } from '@/utils/namespace';
import { useCheckGroup } from '@/mixins/use-check-group';

const NAMESPACE = 'RadioButtonGroup';
const [createComponent, bem] = createNamespace('radio-button-group');

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
