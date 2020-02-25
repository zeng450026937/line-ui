import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('radio-indicator');

export default createComponent({
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
        {...data}
        class={[
          bem({
            checked  : props.checked,
            disabled : props.disabled,
          }),
          data.class,
        ]}
      ></div>
    );
  },
});
