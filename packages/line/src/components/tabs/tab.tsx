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

  data() {
    return {};
  },

  methods: {
    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },

  render() {
    const { checked, tab } = this;

    return (
      <div
        class={[
          bem({ hidden: !checked }),
          // { 'line-page': component === undefined },
        ]}
        role="tabpanel"
        aria-hidden={!checked ? 'true' : null}
        aria-labelledby={`tab-button-${tab}`}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
