import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItem } from 'skyline/mixins/use-check-item';
import { Icon } from 'skyline/components/icon';

const NAMESPACE = 'Collapse';
const [createComponent, bem] = createNamespace('collapse-item');

export default createComponent({
  mixins : [useCheckItem(NAMESPACE)],

  components : {
    Icon,
  },

  props : {
    title : {
      type    : String,
      default : '',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
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
            <icon
              class={ bem('title-icon', { rotate: checked }) }
              name="expand_more"
              width="18"
              height="18"
            ></icon>
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
