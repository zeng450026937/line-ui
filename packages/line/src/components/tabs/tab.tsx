import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItemWithModel } from '@line-ui/line/src/mixins/use-check-item';

const NAMESPACE = 'Tabs';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('tab');

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useCheckItemWithModel(NAMESPACE)],

  props: {
    title: String,
    tab: String,
  },

  render() {
    const { checked, tab, modelValue } = this;

    return (
      <div
        class={[bem({ hidden: !checked }), { 'line-page': this.hasSlot() }]}
        role="tabpanel"
        aria-hidden={!checked ? 'true' : null}
        aria-labelledby={`tab-button-${tab || modelValue}`}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
