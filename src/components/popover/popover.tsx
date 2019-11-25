import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import '@/components/popover/popover.scss';

const [createComponent, bem] = createNamespace('popover');

export default createComponent({
  mixins : [usePopup()],

  props : {
    actions : {
      type    : Array,
      default : [],
    },
  },

  render() {
    return (
      <div v-show={this.visible} class={bem()}>
        <div class={bem('arrow')}></div>
        <div class={bem('content')}></div>
      </div>
    );
  },
});
