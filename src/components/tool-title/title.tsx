import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/tool-title/title.scss';
import '@/components/tool-title/title.ios.scss';

const [createComponent, bem] = createNamespace('title');

export default createComponent({
  mixins : [
    useColor(),
  ],

  props : {
    // large | small | default
    size : String,
  },

  render() {
    return (
      <div
        class={bem({
          [this.size] : true,
        })}
      >
        <div class={bem('inner')}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
