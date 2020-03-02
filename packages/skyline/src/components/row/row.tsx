import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('row');

export default /*#__PURE__*/ createComponent({
  functional : true,

  render(h, { data, slots }) {
    return (
      <div
        class={bem()}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
