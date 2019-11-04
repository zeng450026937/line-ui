<script>
import Vue from 'vue';
import SwitchIndicator from './SwitchIndicator.vue';
import { AbstractButton } from '@/components/button';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'SwitchGroup';

export default {
  name: 'Switch',

  mixins: [useGroupItem(NAMESPACE)],

  extends: AbstractButton,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    genIndicator() {
      return this.$createElement(SwitchIndicator, {
        props: {
          checked: this.checked,
          disabled: this.disabled,
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
    this.staticClass += ' switch';
  },
};
</script>

<style lang="scss">
.switch {
  margin: 4px;
}
</style>
