import { createNamespace } from 'skyline/utils/namespace';
import { useCheckGroup } from 'skyline/mixins/use-check-group';

const NAMESPACE = 'Collapse';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('collapse');

export default /*#__PURE__*/ createComponent({
  mixins : [useCheckGroup(NAMESPACE)],

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
