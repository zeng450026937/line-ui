import { createNamespace } from '@/utils/namespace';
import { useCheckItem } from '@/mixins/use-check-item';
import { useRipple } from '@/mixins/use-ripple';

import '@/components/radio/radio.md.scss';
import '@/components/radio/radio.scss';

const NAMESPACE = 'RadioGroup';

const [createComponent, bem] = createNamespace('radio');

export default createComponent({
  mixins : [useCheckItem(NAMESPACE), useRipple()],

  props : {
    text : String,
  },

  render() {
    const { checked, disabled, text } = this;

    return (
      <div
        class={bem({
          checked,
          disabled,
        })}
        role="radio"
        onClick={this.toggle}
        on={this.$listeners}
      >
        <div class={bem('icon')}>
          <div class={bem('inner')}/>
        </div>
        {this.slots()}
        <button
          type="button"
          disabled={disabled}
        >
        </button>
      </div>
    );
  },
});
