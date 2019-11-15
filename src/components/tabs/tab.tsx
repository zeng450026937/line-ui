import { useGroupItem } from '@/components/group';
import { createNamespace } from '@/utils/namespace';
import '@/components/tabs/tab.scss';

const NAMESPACE = 'Tabs';
const [createComponent, bem] = createNamespace('tab');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE)],

  props : {
    title : {
      type    : String,
      default : '',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
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

  render() {
    const { checked } = this;

    return (
      <div class={{ 'tabs__nav-item': true, 'tabs__nav-item--active': checked }}
        onClick={() => { this.onClick(); }}>
        {this.slots('title') ? this.slots('title') : this.title}
      </div>
    );
  },

});
