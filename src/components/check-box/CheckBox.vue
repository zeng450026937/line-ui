<script lang="js">
import Vue from 'vue';
import { AbstractButton } from '@/components/button';
import { SvgIcon } from '@/components/icon';
import { createGroupItem } from '@/components/group';

export const CheckState = {
  Unchecked: 1,
  PartiallyChecked: 2,
  Checked: 3,
};

export default Vue.extend({
  name: 'CheckBox',

  mixins: [createGroupItem('CheckBoxGroup')],

  extends: AbstractButton,

  components: {
    SvgIcon,
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    checkState: {
      type: Number,
      default: CheckState.Unchecked,
    },
    nextCheckState: {
      type: Function,
      default() {
        return this.checkState === Checked ? Unchecked : Checked;
      },
    },
    tristate: {
      type: Boolean,
      default: false,
    },
    checkable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
      default: null,
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
        this.$emit('change', !this.value);
      }
    },
  },

  watch: {
    value: {
      handler(val) {
        this.checked = val;
      },
      immediate: true,
    },

    checked: {
      handler(val) {
        this.$emit('change', val);
      },
      immediate: true,
    },
  },

  render(h) {
    const vnode = AbstractButton.options.render.call(this, h);
    vnode.data.staticClass += ' check-box';
    vnode.data.class = {
      ...vnode.data.class,
      'is-checked': this.checked,
      'is-disabled': this.disabled,
    };
    return vnode;
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
