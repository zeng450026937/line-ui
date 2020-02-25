import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import ripple from '@/directives/ripple';

const [createComponent, bem] = createNamespace('chip');

export default createComponent({
  mixins : [useColor()],

  directives : { ripple },

  props : {
    ripple  : Boolean,
    outline : Boolean,
  },

  methods : {
    onClick() {
      this.$emit('close');
    },
  },

  render() {
    const { ripple, outline } = this;
    return (
      <div
        vRipple={ripple}
        class={[
          bem({ outline }),
          { 'line-activatable': true },
        ]}
      >
        {this.slots()}
        {/* {mode === 'md' && <line-ripple-effect></line-ripple-effect>} */}
      </div>
    );
  },
});
