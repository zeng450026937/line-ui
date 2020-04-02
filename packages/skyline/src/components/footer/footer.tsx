import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('footer');

export default /*#__PURE__*/ createComponent({
  inject : {
    App : { default: undefined },
  },

  props : {
    translucent : Boolean,
  },

  data() {
    return {
      isAppFooter : false,
    };
  },

  beforeMount() {
    this.isAppFooter = this.App === this.$parent;
  },

  render() {
    const { translucent } = this;

    return (
      <div
        role="contentinfo"
        class={bem({ translucent })}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
