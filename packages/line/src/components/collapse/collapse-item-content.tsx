import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCollapseTransition } from '@line-ui/line/src/mixins/use-collapse-transiton';

const { createComponent } = /*#__PURE__*/ createNamespace(
  'collapse-item-content'
);

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useCollapseTransition()],

  props: {
    checked: Boolean,
  },

  render() {
    const { checked } = this;
    return (
      <div class="line-collapse-item__wrapper" vShow={checked}>
        <div class="line-collapse-item__content">{this.slots()}</div>
      </div>
    );
  },
});
