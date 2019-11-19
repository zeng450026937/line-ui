import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';
import RadioIndicator from '@/components/radio-button/radio-indicator';
import '@/components/radio-button/radio-button.scss';

const NAMESPACE = 'RadioButtonGroup';

const [createComponent, bem] = createNamespace('radio-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE), useRipple()],

  props : {
    disabled : Boolean,
    text     : String,
  },

  methods : {
    onClick() {
      if (this.checked) return;
      if (this.disabled) return;
      this.toggle();
    },
  },

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
        onClick={this.onClick}
      >
        <RadioIndicator
          checked={this.cheched}
          disabled={this.disabled}
        ></RadioIndicator>
        { this.slots() || this.text }
      </div>
    );
  },
});
