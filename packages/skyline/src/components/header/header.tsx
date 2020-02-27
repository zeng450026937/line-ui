import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('header');

export default createComponent({
  inject : ['App'],

  props : {
    collapse    : String,
    translucent : Boolean,
  },

  data() {
    return {
      isAppHeader : false,
    };
  },

  created() {
    this.isAppHeader = this.App === this.$parent;
  },

  render() {
    const mode = 'ios';
    const collapse = this.collapse || 'none';
    return (
      <div
        role="banner"
        class={[
          bem(),
          `line-header-${ mode }`,
          `line-header-collapse-${ collapse }`,
          this.translucent && 'line-header-translucent',
          this.translucent && `line-header-translucent-${ mode }`,
        ]}
        on={this.$listeners}
      >
        {this.slots()}
      </div>
    );
  },
});
