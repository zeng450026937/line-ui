import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';
import '@/components/tab-button/tab-button.scss';

const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE, { uncheckable: false }), useRipple()],

  props : {
    // This property holds a textual description of the button.
    text : String,
  },

  render() {
    return (
      <div
        class={bem({
          checked  : this.checked,
          disabled : this.disabled,
        })}
        on={ this.$listeners }
      >
        { this.slots() || this.text }
      </div>
    );
  },
});
