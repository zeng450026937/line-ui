import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItem } from 'skyline/mixins/use-check-item';
import { useRipple } from 'skyline/mixins/use-ripple';
import RadioIndicator from 'skyline/components/radio-button/radio-indicator';

const NAMESPACE = 'RadioButtonGroup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio-button');

export default /*#__PURE__*/ createComponent({
  mixins : [useCheckItem(NAMESPACE), useRipple()],

  props : {
    text : String,
  },

  render() {
    const { checked, disabled, text } = this;

    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        {
          this.slots('indicator') || (
            <RadioIndicator
              checked={checked}
              disabled={disabled}
            ></RadioIndicator>)
        }
        { this.slots() || text }
      </div>
    );
  },
});
