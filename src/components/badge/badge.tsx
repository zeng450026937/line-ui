import { createNamespace } from '@/utils/namespace';
import '@/components/badge/badge.scss';

const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];
const [createComponent, bem] = createNamespace('badge');

export default createComponent({
  props : {
    color : {
      type    : String,
      default : 'danger', // primary, success, warning, danger, light, dark
    },
    value : {
      type    : Number,
      default : 0,
    },
    visible : {
      type    : Boolean,
      default : true,
    },
    dot : {
      type    : Boolean,
      default : false,
    },
    left : {
      type    : Boolean,
      default : false,
    },
    bottom : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    badgeValue(): number | null {
      const value = this.dot ? null : this.value;

      return value;
    },

    badgeStyle(): { backgroundColor?: string } {
      const style: { backgroundColor?: string } = {};
      if (!colors.includes(this.color)) {
        style.backgroundColor = this.color;
      }

      return style;
    },
  },


  render() {
    const { badgeValue, visible } = this;

    return (
      <div class={bem({
        left         : this.left,
        bottom       : this.bottom,
        dot          : this.dot,
        [this.color] : colors.includes(this.color),
      })}>
        {this.slots()}
        {visible && (
          <span class={bem('content')}
            style="badgeStyle">
            { badgeValue }
          </span>
        )}
      </div>
    );
  },

});
