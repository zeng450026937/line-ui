import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItem } from 'skyline/mixins/use-check-item';
import { useRipple } from 'skyline/mixins/use-ripple';
import { createColorClasses, useColor } from 'skyline/mixins/use-color';

const NAMESPACE = 'RadioGroup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItem(NAMESPACE),
    /*#__PURE__*/ useRipple(),
    /*#__PURE__*/ useColor(),
  ],

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
      checked, disabled, color, inItem,
    } = this;

    return (
      <div
        class={[
          bem({
            checked,
            disabled,
          }),
          { ...createColorClasses(color), 'in-item': inItem },
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
