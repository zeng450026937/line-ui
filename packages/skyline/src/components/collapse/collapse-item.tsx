import { createNamespace } from 'skyline/src/utils/namespace';
import { useCheckItem } from 'skyline/src/mixins/use-check-item';
import { Icon } from 'skyline/src/components/icon';

const NAMESPACE = 'Collapse';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('collapse-item');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItem(NAMESPACE),
  ],

  props : {
    title    : String,
    disabled : Boolean,
  },

  methods : {
    onClick() {
      if (this.checkable && !this.disabled) {
        this.checked = !this.checked;
      }
    },
  },

  render() {
    const { checked, disabled, title } = this;
    return (
      <div
        class={ bem({ active: checked }) }
      >
        <div
          class={ bem('title', { disabled }) }
          onClick={ this.onClick }
        >
          { this.slots('title') || title }
          { this.slots('icon') || (
            <Icon
              class={ bem('title-icon', { rotate: checked }) }
              name="expand_more"
              width="18"
              height="18"
            >
            </Icon>
          )}

        </div>
        {checked && (
          <div class={bem('content')}>
            {this.slots()}
          </div>)}
      </div>
    );
  },
});
