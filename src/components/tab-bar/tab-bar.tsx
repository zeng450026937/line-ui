import { createColorClasses, useColor } from '@/mixins/use-color';
// import { getSkylineMode } from '@/utils/config';
import { createNamespace } from '@/utils/namespace';
import { useCheckGroupWithModel } from '@/mixins/use-check-group';
// import { useOptions } from '@/mixins/use-options';

import '@/components/tab-bar/tab-bar.ios.scss';
import '@/components/tab-bar/tab-bar.scss';

const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-bar');

export default createComponent({
  mixins : [useCheckGroupWithModel(NAMESPACE), useColor()],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
    keyboardVisible : {
      type    : Boolean,
      default : false,
    },
    value : {
      type    : String,
      default : '',
    },
    translucent : {
      type    : Boolean,
      default : false,
    },
  },

  render() {
    const { color, translucent, keyboardVisible } = this;

    return (
      <div
        class={[
          bem({
            translucent,
            hidden : keyboardVisible,
          }),
          { ...createColorClasses(color) },
        ]}
      >
        {this.slots()}
      </div>
    );
  },
});
