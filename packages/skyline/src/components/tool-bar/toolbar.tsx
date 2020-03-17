import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('toolbar');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
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
