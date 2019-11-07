
<script>
import Vue from 'vue';
import { AbstractButton } from '@/components/button';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'TabBar';
export default Vue.extend({
  name: 'TabButton',

  mixins: [useGroupItem(NAMESPACE)],

  extends: AbstractButton,

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    class() {
      return {
        'is--active': this.checked,
        'is--disabled': this.disabled,
      };
    },
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

  created() {
    this.staticClass += ' tab-button';
  },
});
</script>

<style lang="scss">
.tab-button {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content {
    margin-bottom: 8px;
  }
  &.is--active {
    color: var(--primary);
  }

  &.is--disabled {
    color: #9f9f9f;
    cursor: not-allowed;
  }
}
</style>
