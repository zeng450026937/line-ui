import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItem } from '@line-ui/line/src/mixins/use-check-item';
import { useRipple } from '@line-ui/line/src/mixins/use-ripple';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import CheckIndicator from '@line-ui/line/src/components/check-box/check-indicator';

const NAMESPACE = 'CheckBoxGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-box');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItem(NAMESPACE),
    /*#__PURE__*/ useRipple(),
    /*#__PURE__*/ useColor(),
  ],

  inject : {
    Item : { default: undefined },
  },

  props : {
    text          : String,
    color         : String,
    indeterminate : Boolean,
  },

  data() {
    return {
      inItem : false,
    };
  },

  mounted() {
    this.inItem = this.$el.closest('.line-item') !== null;
    this.emitStyle();
  },

  methods : {
    emitStyle() {
      const { Item } = this;

      if (!Item) return;

      Item.itemStyle(
        'check-box',
        {
          'checkbox-checked'     : this.checked,
          'interactive-disabled' : this.disabled,
        },
      );
    },
  },

  watch : {
    checked() {
      this.emitStyle();
    },

    disabled() {
      this.emitStyle();
    },
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
            >
            </CheckIndicator>
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
