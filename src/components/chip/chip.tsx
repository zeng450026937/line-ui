import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';
import '@/components/chip/chip.scss';

const [createComponent, bem] = createNamespace('chip');
const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];

export default createComponent({
  components : {
    Icon,
  },

  props : {
    color : {
      type    : String,
      default : '',
    },
    border : {
      type    : Boolean,
      default : false,
    },
    closeIcon : {
      type    : String,
      default : '',
    },
  },

  methods : {
    onClick() {
      this.$emit('close');
    },
  },

  render() {
    const { border, color, closeIcon } = this;
    return (
      <div
        class={bem({ border, [color]: colors.includes(color) })}
      >
        <span
          class={bem('content')}
        >
          {this.slots()}
        </span>
        {closeIcon && (
        <span
          class={bem('close')}
          onClick={this.onClick}
        >
          <icon
            name={closeIcon}
            height="18"
            width="18"
          ></icon>
        </span>)}
      </div>
    );
  },
});
