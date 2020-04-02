import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('item-divider');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  props : {
    sticky : Boolean,
  },

  render() {
    const { sticky = false } = this;

    return (
      <div
        class={bem({ sticky })}
        on={this.$listeners}
      >
        {this.slots('start')}

        <div class={bem('inner')}>
          <div class={bem('wrapper')}>
            {this.slots()}
          </div>

          {this.slots('end')}
        </div>
      </div>
    );
  },
});
