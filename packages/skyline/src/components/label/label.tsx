import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import { isDef } from 'skyline/src/utils/helpers';

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
      const { Item, position } = this;
      if (!Item) return;
      Item.itemStyle(
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
        class={
          bem({
            [position]   : isDef(position),
            'no-animate' : this.noAnimate,
          })
        }
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
