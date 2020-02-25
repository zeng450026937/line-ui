import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('footer');

export default createComponent({
  inject : ['App'],

  props : {
    translucent : Boolean,
  },

  data() {
    return {
      isAppFooter : false,
    };
  },

  created() {
    this.isAppFooter = this.App === this.$parent;
  },

  render() {
    const { translucent } = this;
    return (
      <div
        role="contentinfo"
        class={bem({ translucent })}
      >
        {this.slots()}
      </div>
    );
  },
});
