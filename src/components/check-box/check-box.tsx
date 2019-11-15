import { AbstractButton } from '@/components/button';
import CheckIndicator from '@/components/check-box/CheckIndicator.vue';
import { useGroupItem } from '@/components/group';
import { createNamespace } from '@/utils/namespace';

import '@/components/check-box/check-box.scss';

const NAMESPACE = 'CheckBoxGroup';

const [createComponent, bem] = createNamespace('check-box');

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
      return this.$createElement(CheckIndicator, {
        props : {
          checked       : this.checked,
          indeterminate : this.indeterminate,
          disabled      : this.disabled,
          width         : 20,
          height        : 20,
        },
      });
    },

    onClick() {
      if (this.checkable && !this.disabled) {
        this.checked = !this.checked;
        // TODO
        // check all children if has
      }
    },
  },

  created() {
    this.staticClass += ' line-check-box';
  },
});
