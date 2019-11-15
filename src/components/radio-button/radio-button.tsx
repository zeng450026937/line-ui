import { AbstractButton } from '@/components/button';
import RadioIndicator from './RadioIndicator.vue';
import { useGroupItem } from '@/components/group';
import { createNamespace } from '@/utils/namespace';

import '@/components/radio-button/radio-button.scss';

const NAMESPACE = 'RadioButtonGroup';

const [createComponent, bem] = createNamespace('radio-button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE)],

  extends : AbstractButton,

  props : {
    disabled : {
      type    : Boolean,
      default : false,
    },
    indeterminate : {
      type    : Boolean,
      default : false,
    },
  },

  methods : {
    genIndicator() {
      return this.$createElement(RadioIndicator, {
        props : {
          checked  : this.checked,
          disabled : this.disabled,
        },
      });
    },

    onClick() {
      if (this.checked) {
        return;
      }
      if (this.checkable && !this.disabled) {
        this.checked = true;
      }
    },
  },

  created() {
    this.staticClass += ' line-radio-button';
  },
});
