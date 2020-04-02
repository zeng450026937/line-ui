import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItemWithModel } from '@line-ui/line/src/mixins/use-check-item';
import { useRipple } from '@line-ui/line/src/mixins/use-ripple';

const NAMESPACE = 'TabBar';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('tab-button');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItemWithModel(NAMESPACE),
    /*#__PURE__*/ useRipple(),
  ],

  props : {
    // This property holds a textual description of the button.
    text     : String,
    layout   : String,
    tab      : String,
    disabled : Boolean,
  },

  computed : {
    hasLabel(): boolean {
      return this.$el && !!this.$el.querySelector('.line-label');
    },
    hasIcon(): boolean {
      return this.$el && !!this.$el.querySelector('.line-icon');
    },
  },

  methods : {
    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },

  render() {
    const { hasLabel, hasIcon, mode } = this;

    return (
      <div
        class={[
          bem({
            'has-label'      : hasLabel,
            'has-icon'       : hasIcon,
            'has-label-only' : hasLabel && !hasIcon,
            'has-icon-only'  : hasIcon && !hasLabel,
          }),
          {
            'tab-selected'     : this.checked,
            'tab-disabled'     : this.disabled,
            'line-activatable' : true,
            'line-selectable'  : true,
            'line-focusable'   : true,
          },
        ]}
        onClick={ this.onClick }
        on={this.$listeners}
      >
        <div
          class="button-native"
          tabIndex={-1}
        >
          <span class="button-inner">
            { this.slots() || this.text }
          </span>
          {mode === 'md' && <line-ripple-effect type="unbounded"></line-ripple-effect>}
        </div>
      </div>
    );
  },
});
