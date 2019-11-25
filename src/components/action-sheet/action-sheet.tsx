import { createNamespace } from '@/utils/namespace';
import { usePopup } from '@/mixins/use-popup';
import '@/components/action-sheet/action-sheet.scss';

const [createComponent, bem] = createNamespace('action-sheet');

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
        <div class={bem('header')}>
          {this.slots('header')}
        </div>

        <div class={bem('content')}>
          {this.actions.map((action) => {
            return (
              <div class={bem('action')}>{action}</div>
            );
          })}
        </div>

        <div class={bem('footer')}>
          {this.slots('footer')}
        </div>
      </div>
    );
  },
});
