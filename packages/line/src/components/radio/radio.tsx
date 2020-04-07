import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItemWithModel } from '@line-ui/line/src/mixins/use-check-item';
import { useRipple } from '@line-ui/line/src/mixins/use-ripple';
import { useColor } from '@line-ui/line/src/mixins/use-color';

import RadioIndicator from '@line-ui/line/src/components/radio/radio-indicator';

const NAMESPACE = 'RadioGroup';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio');

export default /*#__PURE__*/ createComponent({
  mixins: [
    /*#__PURE__*/ useCheckItemWithModel(NAMESPACE),
    /*#__PURE__*/ useRipple(),
    /*#__PURE__*/ useColor(),
  ],

  inject: {
    Item: { default: undefined },
  },

  data() {
    return {
      inItem: false,
    };
  },

  mounted() {
    this.inItem = this.$el.closest('.line-item') !== null;
    this.emitStyle();
  },

  methods: {
    emitStyle() {
      const { Item } = this;
      if (!Item) return;
      Item.itemStyle('radio', {
        'radio-checked': this.checked,
        'interactive-disabled': this.disabled,
      });
    },

    onClick() {
      if (this.disabled) return;

      this.$emit('clicked');

      if (!this.checkable) return;

      if (this.RadioGroup && this.checked) return;

      this.checked = !this.checked;

      this.$emit('change', this.checked);
    },
  },

  watch: {
    color() {
      this.emitStyle();
    },

    checked() {
      this.emitStyle();
    },

    disabled() {
      this.emitStyle();
    },
  },

  render() {
    const { checked, disabled, inItem } = this;

    return (
      <div
        class={[
          bem({
            checked,
            disabled,
          }),
          { 'in-item': inItem },
        ]}
        role="radio"
        onClick={this.onClick}
        on={this.$listeners}
      >
        <RadioIndicator checked={checked} disabled={disabled}></RadioIndicator>

        {this.slots()}

        <button type="button" disabled={disabled}></button>
      </div>
    );
  },
});
