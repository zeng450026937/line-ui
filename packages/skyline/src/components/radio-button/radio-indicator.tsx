import { createNamespace } from 'skyline/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('radio-indicator');

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    checked : {
      type    : Boolean,
      default : false,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  render(h, { props, data }) {
    return (
      <div
        class={[
          bem({
            checked  : props.checked,
            disabled : props.disabled,
          }),
          data.class,
        ]}
        {...data}
      ></div>
    );
  },
});
