import { useColor } from 'skyline/mixins/use-color';
import { createNamespace } from 'skyline/utils/namespace';
import { useCheckGroupWithModel } from 'skyline/mixins/use-check-group';

const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-bar');

export default createComponent({
  mixins : [useCheckGroupWithModel(NAMESPACE), useColor()],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
    keyboardVisible : {
      type    : Boolean,
      default : false,
    },
    value : {
      type    : String,
      default : '',
    },
    translucent : {
      type    : Boolean,
      default : false,
    },
  },

  render() {
    const { translucent, keyboardVisible } = this;

    return (
      <div
        class={bem({
          translucent,
          hidden : keyboardVisible,
        })}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
