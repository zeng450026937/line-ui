import { useGroup } from 'skyline/mixins/use-group';
import { createNamespace } from 'skyline/utils/namespace';

const NAMESPACE = 'SwitchGroup';
const [createComponent, bem] = createNamespace('switch-group');

export default /*#__PURE__*/ createComponent({
  extends : useGroup(NAMESPACE),

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },

});
