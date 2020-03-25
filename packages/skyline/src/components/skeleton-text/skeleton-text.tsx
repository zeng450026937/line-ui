import { createNamespace } from 'skyline/src/utils/namespace';
import { config } from 'skyline/src/utils/config';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('skeleton-text');

export default /*#__PURE__*/ createComponent({
  props : {
    animated : Boolean,
  },

  render() {
    const animated = this.animated && config.getBoolean('animated', true);
    const inMedia = this.$el && (this.$el.closest('.line-avatar') || this.$el.closest('.line-thumbnail'));

    return (
      <div
        class={[
          bem(),
          {
            'skeleton-text-animated' : animated,
            'in-media'               : inMedia,
          },
        ]}
      >
        <span>&nbsp;</span>
      </div>
    );
  },

});
