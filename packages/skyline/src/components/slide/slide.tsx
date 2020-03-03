import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('slide');

export default /*#__PURE__*/ createComponent({
  render() {
    return (
      <div
        class={[
          bem(),
          {
            'swiper-slide'          : true,
            'swiper-zoom-container' : true,
          },
        ]}
      >
        {this.slots()}
      </div>
    );
  },

});
