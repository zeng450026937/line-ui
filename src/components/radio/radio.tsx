import { createNamespace } from '@/utils/namespace';
import { useCheckItem } from '@/mixins/use-check-item';
import { useRipple } from '@/mixins/use-ripple';
import { createColorClasses, useColor } from '@/mixins/use-color';

const NAMESPACE = 'RadioGroup';

const [createComponent, bem] = createNamespace('radio');

export default createComponent({
  mixins : [useCheckItem(NAMESPACE), useRipple(), useColor()],

  render() {
    const { checked, disabled, color } = this;

    return (
      <div
        class={[
          bem({
            checked,
            disabled,
          }),
          { ...createColorClasses(color) },
        ]}
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
