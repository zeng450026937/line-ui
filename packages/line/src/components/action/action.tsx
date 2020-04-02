import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useGroupItem } from '@line-ui/line/src/mixins/use-group-item';
import { useRipple } from '@line-ui/line/src/mixins/use-ripple';

const NAMESPACE = 'ActionGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('action');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useGroupItem(NAMESPACE),
    /*#__PURE__*/ useRipple(),
  ],

  props : {
    // This property holds a textual description of the action.
    text      : String,
    // This property holds a icon description of the action.
    icon      : [String, Object],
    // override default
    checkable : {
      type    : Boolean,
      default : false,
    },
  },

  beforeMount() {
    this.$on('clicked', (...args: any[]) => {
      this.$emit('triggered', ...args);
    });
  },

  methods : {
    trigger() {
      if (!this.disabled) return;
      this.$emit('triggered');
    },
  },

  render() {
    return (
      <div
        class={bem({
          checked  : this.checked,
          disabled : this.disabled,
        })}
        on={ this.$listeners }
      >
        { this.slots() || this.text }
      </div>
    );
  },
});