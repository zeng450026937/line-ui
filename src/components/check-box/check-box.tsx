import { createNamespace } from '@/utils/namespace';
import { useCheckItem } from '@/mixins/use-check-item';
import { useRipple } from '@/mixins/use-ripple';
import { useColor } from '@/mixins/use-color';
import CheckIndicator from '@/components/check-box/check-indicator';

import '@/components/check-box/check-box.ios.scss';
import '@/components/check-box/check-box.scss';

const NAMESPACE = 'CheckBoxGroup';
const [createComponent, bem] = createNamespace('check-box');

export default createComponent({
  mixins : [useCheckItem(NAMESPACE), useRipple(), useColor()],

  props : {
    indeterminate : Boolean,
    text          : String,
    color         : String,
  },

  render() {
    const {
      checked, indeterminate, disabled, text,
    } = this;
    return (
      <div
        class={bem({
          disabled,
          indeterminate,
          checked,
        })}
        role="checkbox"
        on={this.$listeners}
        onClick={this.toggle}
      >
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
