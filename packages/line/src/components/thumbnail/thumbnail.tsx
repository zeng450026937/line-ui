import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('thumbnail');

export default /*#__PURE__*/ createComponent({
  functional: true,

  render(h, { data, slots }) {
    return (
      <div class={bem()} {...data}>
        {slots()}
      </div>
    );
  },
});
