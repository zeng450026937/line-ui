import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('avatar');

export default /*#__PURE__*/ createComponent({
  functional : true,

  render(h, ctx) {
    return (
      <div
        class={bem()}
        {...ctx.data}
      >
        {ctx.slots()}
      </div>
    );
  },
});
