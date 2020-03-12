import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { isDef } from 'skyline/utils/helpers';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('label');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  inject : {
    Item : { default: undefined },
  },

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
    // this.noAnimate = (position === 'floating');
    return (
      <div
        class={[
          bem(),
          {
            [`label-${ position }`] : isDef(position),
            'label-no-animate'      : (this.noAnimate),
          },
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
