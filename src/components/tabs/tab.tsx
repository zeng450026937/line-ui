import { createNamespace } from '@/utils/namespace';
import { useCheckItemWithModel } from '@/mixins/use-check-item';
import '@/components/tabs/tab.scss';

const NAMESPACE = 'Tabs';
const [createComponent, bem] = createNamespace('tab');

export default createComponent({
  mixins : [useCheckItemWithModel(NAMESPACE)],

  props : {
    title : {
      type    : String,
      default : '',
    },
    tab : String,
  },

  data() {
    return {

    };
  },

  methods : {
    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },

  mounted() {

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
        aria-labelledby={`tab-button-${ tab }`}
      >
        {this.slots()}
      </div>
    );
  },

});
