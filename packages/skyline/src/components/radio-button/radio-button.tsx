import { createNamespace } from 'skyline/src/utils/namespace';
import { useCheckItem } from 'skyline/src/mixins/use-check-item';
import { useRipple } from 'skyline/src/mixins/use-ripple';
import RadioIndicator from 'skyline/src/components/radio-button/radio-indicator';

const NAMESPACE = 'RadioButtonGroup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio-button');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItem(NAMESPACE),
    /*#__PURE__*/ useRipple(),
  ],

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
