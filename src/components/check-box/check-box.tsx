import { createNamespace } from '@/utils/namespace';
import { useGroupItem } from '@/mixins/use-group-item';
import { useRipple } from '@/mixins/use-ripple';
import CheckIndicator from '@/components/check-box/check-indicator';

import '@/components/check-box/check-box.scss';

const NAMESPACE = 'CheckBoxGroup';
const [createComponent, bem] = createNamespace('check-box');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE), useRipple()],

  props : {
    indeterminate : Boolean,
    text          : String,
  },

  render() {
    const {
      checked, indeterminate, disabled, text,
    } = this;
    return (
      <div
        class={bem()}
        on={this.$listeners}
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
              width={20}
              height={20}
            ></CheckIndicator>
          )
        }
        { this.slots() || text }
      </div>
    );
  },
});
