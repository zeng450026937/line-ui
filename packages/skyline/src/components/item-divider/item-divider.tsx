import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';

const [createComponent, bem] = createNamespace('item-divider');

export default createComponent({
  mixins : [useColor()],

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
