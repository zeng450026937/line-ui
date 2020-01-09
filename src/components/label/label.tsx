import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/label/label.scss';
import '@/components/label/label.ios.scss';

const [createComponent, bem] = createNamespace('label');

export default createComponent({
  mixins : [useColor()],

  props : {
    position : String,
  },

  render() {
    const { position } = this;
    return (
      <div
        class={[
          bem(),
          {
            [`label-${ position }`] : !!position,
            'label-no-animate'      : (this.noAnimate),
          },
        ]}
      ></div>
    );
  },
});
