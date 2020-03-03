import { useGroup } from 'skyline/mixins/use-group';
import { createNamespace } from 'skyline/utils/namespace';

const NAMESPACE = 'SwitchGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('switch-group');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useGroup(NAMESPACE),
  ],

  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },

});
