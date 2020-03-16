import { createNamespace } from 'skyline/src/utils/namespace';
import { useCheckGroupWithModel } from 'skyline/src/mixins/use-check-group';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('check-group');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckGroupWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()}>
        { this.slots() }
      </div>
    );
  },
});
