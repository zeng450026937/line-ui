import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckGroup } from '@line-ui/line/src/mixins/use-check-group';

const NAMESPACE = 'Collapse';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('collapse');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckGroup(NAMESPACE),
  ],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
