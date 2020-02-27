import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItem } from 'skyline/mixins/use-check-item';
import { useRipple } from 'skyline/mixins/use-ripple';
import { useColor } from 'skyline/mixins/use-color';
import CheckIndicator from 'skyline/components/check-box/check-indicator';

const NAMESPACE = 'CheckBoxGroup';
const [createComponent, bem] = createNamespace('check-box');

export default createComponent({
  mixins : [useCheckItem(NAMESPACE), useRipple(), useColor()],

  props : {
    indeterminate : Boolean,
    text          : String,
    color         : String,
  },

  data() {
    return {
      inItem : false,
    };
  },

  mounted() {
    this.inItem = this.$el.closest('.line-item') !== null;
  },

  render() {
    const {
      checked, indeterminate, disabled, text, inItem,
    } = this;

    return (
      <div
        class={[
          bem({
            disabled,
            indeterminate,
            checked,
          }),
          { 'in-item': inItem },
        ]}
        role="checkbox"
        on={this.$listeners}
        onClick={this.toggle}
        >
        {/* on={this.$listeners} */}
        {
          this.slots(
            'indicator',
            { checked, indeterminate, disabled },
          ) || (
            <CheckIndicator
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              width={26}
              height={26}
            ></CheckIndicator>
          )
        }
        { this.slots() || text }
        <button
          type="button"
          disabled={disabled}
        >
        </button>
      </div>
    );
  },
});
