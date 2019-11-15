import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/components/group';
import '@/components/radio-button/radio-button-group.scss';

const NAMESPACE = 'RadioButtonGroup';

const [createComponent, bem] = createNamespace('radio-button-group');

export default createComponent({
  extends : useGroup(NAMESPACE),

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
