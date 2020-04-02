import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';
import ripple from '@line-ui/line/src/directives/ripple';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('chip');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

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
          'line-activatable',
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
