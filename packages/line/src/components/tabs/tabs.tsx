import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckGroupWithModel } from '@line-ui/line/src/mixins/use-check-group';

const NAMESPACE = 'Tabs';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('tabs');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useCheckGroupWithModel(NAMESPACE)],

  props: {
    exclusive: {
      type: Boolean,
      default: true,
    },
  },

  render() {
    return (
      <div class={bem()} on={this.$listeners}>
        {this.slots('top')}

        <div class={bem('inner')}>{this.slots()}</div>

        {this.slots('bottom')}
      </div>
    );
  },
});
