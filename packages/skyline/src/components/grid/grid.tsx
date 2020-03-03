import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('grid');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    fixed : Boolean,
  },

  render(h, { props, data, slots }) {
    return (
      <div
        class={bem({
          fixed : props.fixed,
        })}
        {...data}
      >
        {slots()}
      </div>
    );
  },
});
