// import { getSkylineMode } from 'skyline/utils/config';
import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItemWithModel } from 'skyline/mixins/use-check-item';
import { useRipple } from 'skyline/mixins/use-ripple';

const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-button');

export default createComponent({
  mixins : [useCheckItemWithModel(NAMESPACE), useRipple()],

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
    const { hasLabel, hasIcon } = this;

    return (
      <div
        class={[
          bem({
            selected : this.checked,
            disabled : this.disabled,
          }),
          {
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
        <a tabIndex={-1}>
          { this.slots() || this.text }
        </a>
      </div>
    );
  },
});
