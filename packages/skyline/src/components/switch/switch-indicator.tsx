import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('switch-indicator');

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

  render(h, { props, data, slots }) {
    const Tag = 'div';

    return (
      <Tag
        class={bem({
          'is-checked'  : props.checked,
          'is-disabled' : props.disabled,
        })}
        {...data}
      >
        <div class={bem('thumb')}>
          {slots()}
        </div>
      </Tag>
    );
  },

});
