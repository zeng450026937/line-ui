// import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';
import { createColorClasses, useColor } from '@/mixins/use-color';
import { getSkylineMode } from '@/utils/config';
import '@/components/chip/chip.scss';

const [createComponent, bem] = createNamespace('chip');
// const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];

export default createComponent({
  mixins : [useColor()],

  // components : {
  //   Icon,
  // },

  props : {
    outline : {
      type    : Boolean,
      default : false,
    },
  },

  methods : {
    onClick() {
      this.$emit('close');
    },
  },

  render() {
    const { outline } = this;
    const mode = getSkylineMode(this);

    return (
      <div
        class={[
          bem({ outline }),
          { activatable: true },
        ]}
      >
        {this.slots()}
        {/* {mode === 'md' && <line-ripple-effect></line-ripple-effect>} */}
      </div>
    );
  },
});
