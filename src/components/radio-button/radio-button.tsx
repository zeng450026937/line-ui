import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';
import RadioIndicator from '@/components/radio-button/radio-indicator';
import '@/components/radio-button/radio-button.scss';

const NAMESPACE = 'RadioButtonGroup';

const [createComponent, bem] = createNamespace('radio-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE, { uncheckable: false }), useRipple()],

  props : {
    text : String,
  },

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        <RadioIndicator
          checked={this.checked}
          disabled={this.disabled}
        ></RadioIndicator>
        { this.slots() || this.text }
      </div>
    );
  },
});
