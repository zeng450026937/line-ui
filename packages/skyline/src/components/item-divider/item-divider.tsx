import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

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
        class={[
          bem({
            sticky,
          }),
          'item',
        ]}
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
