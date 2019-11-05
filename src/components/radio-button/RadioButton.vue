

<script>
import Vue from 'vue';
import RadioIndicator from './RadioIndicator.vue';
import { AbstractButton } from '@/components/button';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'RadioButtonGroup';

export default Vue.extend({
  name: 'RadioButton',

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
      return this.$createElement(RadioIndicator, {
        props: {
          checked: this.checked,
          disabled: this.disabled,
        },
      });
    },

    onClick() {
      if (this.checkable && !this.disabled) {
        this.checked = !this.checked;
      }
    },
  },

  created() {
    this.staticClass += ' radio-button';
  },
});
</script>

<style lang="scss">
.radio-button {
  margin: 4px;
}

.radio-button + .radio-button {
  margin-left: 8px;
}
</style>
