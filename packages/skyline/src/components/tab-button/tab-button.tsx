import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItemWithModel } from 'skyline/mixins/use-check-item';
import { useRipple } from 'skyline/mixins/use-ripple';

const NAMESPACE = 'TabBar';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('tab-button');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItemWithModel(NAMESPACE),
    /*#__PURE__*/ useRipple(),
  ],

  props : {
    // This property holds a textual description of the button.
    text   : String,
    layout : {
      type    : String,
      default : '',
    },
    tab : {
      type    : String,
      default : '',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
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
          }),
          {
            'tab-selected'       : this.checked,
            'tab-disabled'       : this.disabled,
            'line-activatable'   : true,
            'line-selectable'    : true,
            'line-focusable'     : true,
            'tab-has-label'      : hasLabel,
            'tab-has-icon'       : hasIcon,
            'tab-has-label-only' : hasLabel && !hasIcon,
            'tab-has-icon-only'  : hasIcon && !hasLabel,
          },
        ]}
        onClick={ this.onClick }
        on={this.$listeners}
      >
        <div class="button-native" tabIndex={-1}>
          <span class="button-inner">
            { this.slots() || this.text }
          </span>
          {mode === 'md' && <line-ripple-effect type="unbounded"></line-ripple-effect>}
        </div>
      </div>
    );
  },
});
