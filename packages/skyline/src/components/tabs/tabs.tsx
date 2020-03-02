import { createNamespace } from 'skyline/utils/namespace';
import { useCheckGroupWithModel } from 'skyline/mixins/use-check-group';

const NAMESPACE = 'Tabs';
const [createComponent, bem] = createNamespace('tabs');

export default /*#__PURE__*/ createComponent({
  mixins : [useCheckGroupWithModel(NAMESPACE)],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        {this.slots('top')}

        <div class={bem('inner')}>
          {this.slots()}
        </div>

        {this.slots('bottom')}
      </div>
    );
  },

});
