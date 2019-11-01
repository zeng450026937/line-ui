<script>
import Vue from 'vue';
import { AbstractButton } from '@/components/button';
import { SvgIcon } from '@/components/icon';
import { useGroupItem, CheckState } from '@/components/group';

const NAMESPACE = 'CheckBoxGroup';

export default Vue.extend({
  name: 'CheckBox',

  mixins: [useGroupItem(NAMESPACE)],

  extends: AbstractButton,

  components: {
    SvgIcon,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    indeterminate: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    class() {
      return {
        'is-unchecked': !this.indeterminate && !this.checked,
        'is-checked': !this.indeterminate && this.checked,
        'is-indeterminate': this.indeterminate,
        'is-disabled': this.disabled,
      };
    },
  },

  methods: {
    genIndicator() {
      return this.$createElement(SvgIcon, {
        props: { width: 20, height: 20 },
        scopedSlots: {
          content: () => this.$createElement(
            'path', { attrs: { d: 'M1.73,12.91 8.1,19.28 22.79,4.59' } },
          ),
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
    this.staticClass += ' check-box';
  },
});
</script>

<style lang="scss">
.check-box {
  margin: 4px;
  cursor: pointer;

  .svg-icon {
    margin-right: 4px;
    border-radius: 2px;
    border: 1px solid #1a1a1a;
    background-color: transparent;
    svg {
      path {
        fill: none;
        stroke: #ffffff;
        stroke-width: 4;
        transform-origin: center;
        transform: scale(0, 0);
      }
    }
  }

  &.is-checked {
    .svg-icon {
      border-color: #10c29b;
      background-color: #10c29b;
      svg {
        path {
          transition: transform 90ms linear 80ms;
          transition-timing-function: cubic-bezier(0.4, 0, 1, 1),
            cubic-bezier(0.18, 0.89, 0.32, 1.28);
          transform: scale(0.8, 0.8);
        }
      }
    }
  }
  &.is-disabled {
    .svg-icon {
      border-color: #afafaf;
    }
  }
  &.is-disabled.is-checked {
    .svg-icon {
      background-color: #afafaf;
    }
  }
}

// .check-box + .check-box {
//   margin-left: 8px;
// }
</style>
