import { createNamespace } from 'skyline/utils/namespace';
import { useCheckGroup } from 'skyline/mixins/use-check-group';

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
