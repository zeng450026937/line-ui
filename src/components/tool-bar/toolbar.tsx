import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';

const [createComponent, bem] = createNamespace('toolbar');

export default createComponent({
  mixins : [
    useColor(),
  ],

  props : {
  },

  render() {
    return (
      <div
        class={bem()}
        on={this.$listeners}
      >
        <div class={bem('background')}></div>

        <div class={bem('container')}>
          {this.slots('start')}
          {this.slots('secondary')}

          <div class={bem('content')}>
            {this.slots()}
          </div>

          {this.slots('primary')}
          {this.slots('end')}
        </div>
      </div>
    );
  },
});
