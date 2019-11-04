<script lang="js">
import Vue from 'vue';
import AbstractButton from './AbstractButton.vue';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'ButtonGroup';

export default Vue.extend({
  name: 'Button',

  mixins: [useGroupItem(NAMESPACE)],

  extends: AbstractButton,

  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      this.toggle();
    },
  },

  created() {
    this.staticClass += ' button';
  },
});
</script>

<style lang="scss">
.button {
  max-width: 100%;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba($color: #666666, $alpha: 0.8);
  border-radius: 4px;
  color: #666666;
  background-color: #ffffff;
  line-height: 1;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  white-space: nowrap;
  transition: 0.1s;
  user-select: none;
  position: relative;
  outline: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
    border: 1px solid rgba($color: #666666, $alpha: 1);
  }
}
</style>
