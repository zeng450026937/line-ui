import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItemWithModel } from '@line-ui/line/src/mixins/use-check-item';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-item');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useCheckItemWithModel('Group')],

  render() {
    return (
      <div class={bem()} onClick={this.toggle}>
        {this.slots()}
      </div>
    );
  },
});
