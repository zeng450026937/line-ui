import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckGroupWithModel } from '@line-ui/line/src/mixins/use-check-group';

const NAMESPACE = 'RadioGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio-group');

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
        {this.slots()}
      </div>
    );
  },
});
