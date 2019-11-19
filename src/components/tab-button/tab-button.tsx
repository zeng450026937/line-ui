import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import '@/components/tab-button/tab-button.scss';

export const Position = {
  Header : 0,
  Footer : 1,
};
const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE)],

  props : {
    // This property holds a textual description of the button.
    text     : String,
    // This property holds whether the button is disabled.
    disabled : Boolean,
  },

  methods : {
    onClick() {
      if (this.checked) return;
      this.toggle();
    },
  },

  render() {
    return (
      <div
        class={bem({
          checked  : this.checked,
          disabled : this.disabled,
        })}
        on={ this.$listeners }
        onClick={ this.onClick }
      >
        { this.slots() || this.text }
      </div>
    );
  },
});
