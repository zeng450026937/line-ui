import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import ripple from 'skyline/directives/ripple';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('chip');

export default /*#__PURE__*/ createComponent({
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
        on={this.$listeners}
      >
        {this.slots()}
        {/* {mode === 'md' && <line-ripple-effect></line-ripple-effect>} */}
      </div>
    );
  },
});
