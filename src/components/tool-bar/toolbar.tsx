import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/tool-bar/toolbar.scss';
import '@/components/tool-bar/toolbar.ios.scss';

const [createComponent, bem] = createNamespace('toolbar');

export default createComponent({
  mixins : [
    useColor(),
  ],

  props : {
  },

  render() {
    return (
      <div class={bem()}>
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
