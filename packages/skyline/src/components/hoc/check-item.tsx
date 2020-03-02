import { createNamespace } from 'skyline/utils/namespace';
import { useCheckItemWithModel } from 'skyline/mixins/use-check-item';

const [createComponent, bem] = createNamespace('check-item');

export default /*#__PURE__*/ createComponent({
  mixins : [
    useCheckItemWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()} onClick={this.toggle}>
        { this.slots() }
      </div>
    );
  },
});
