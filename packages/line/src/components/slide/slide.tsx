import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('slide');

export default /*#__PURE__*/ createComponent({
  functional: true,

  render(h, { data, slots }) {
    return (
      <div
        class={[
          bem(),
          {
            'swiper-slide': true,
            'swiper-zoom-container': true,
          },
        ]}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
