import { createNamespace } from '@/utils/namespace';
import { AbstractButton } from '@/components/button';
import { useGroupItem } from '@/components/group';
import '@/components/tab-button/tab-button.scss';

export const Position = {
  Header : 0,
  Footer : 1,
};
const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE)],

  extends : AbstractButton,

  props : {
    disabled : {
      type    : Boolean,
      default : false,
    },
  },


  computed : {
    class() {
      return {
        'is--active'   : this.checked,
        'is--disabled' : this.disabled,
      };
    },
  },

  created() {
    this.staticClass += ' line-tab-button';
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
});
