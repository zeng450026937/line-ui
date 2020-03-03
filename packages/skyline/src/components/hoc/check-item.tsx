import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItemWithModel } from 'skyline/mixins/use-check-item';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-item');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItemWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()} onClick={this.toggle}>
        { this.slots() }
      </div>
    );
  },
});
