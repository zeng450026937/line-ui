import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('header');

export default /*#__PURE__*/ createComponent({
  inject : {
    App : { default: undefined },
  },

  props : {
    collapse    : String,
    translucent : Boolean,
  },

  data() {
    return {
      isAppHeader : false,
    };
  },

  beforeMount() {
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
