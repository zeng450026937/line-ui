<script>
import Vue from 'vue';
import { AbstractButton } from '@/components/button';
import CheckIndicator from './CheckIndicator.vue';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'CheckBoxGroup';

export default Vue.extend({
  name : 'CheckBox',

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
    this.staticClass += ' check-box';
  },
});
</script>

<style lang="scss">
.check-box {
  margin: 4px;
}
</style>
