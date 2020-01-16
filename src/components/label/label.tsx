import { createNamespace } from '@/utils/namespace';
import { useColor } from '@/mixins/use-color';
import '@/components/label/label.scss';
import '@/components/label/label.ios.scss';
import { isDef } from '@/utils/helpers';

const [createComponent, bem] = createNamespace('label');

export default createComponent({
  mixins : [useColor()],

  inject : ['Item'],

  props : {
    // 'fixed' | 'stacked' | 'floating' | undefined
    position : String,
  },

  watch : {
    position : 'emitStyle',
  },

  mounted() {
    if (this.noAnimate) {
      setTimeout(() => {
        this.noAnimate = false;
      }, 1000);
    }
    this.emitStyle();
  },

  methods : {
    emitStyle() {
      if (!this.Item) return;
      const { position } = this;
      this.Item.itemStyle(
        'label',
        {
          label                   : true,
          [`label-${ position }`] : isDef(position),
        },
      );
    },
  },

  render() {
    const { position } = this;
    this.noAnimate = (position === 'floating');
    return (
      <div
        class={[
          bem(),
          {
            [`label-${ position }`] : isDef(position),
            'label-no-animate'      : (this.noAnimate),
          },
        ]}
      >
        {this.slots()}
      </div>
    );
  },
});
