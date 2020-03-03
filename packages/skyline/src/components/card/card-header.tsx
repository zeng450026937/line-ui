import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('card-header');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  props : {
    translucent : Boolean,
  },

  render() {
    const { translucent } = this;
    return (
      <div
        class={[
          bem({ translucent }),
          'line-inherit-color',
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
