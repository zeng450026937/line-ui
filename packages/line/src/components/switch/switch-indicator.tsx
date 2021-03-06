import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'switch-indicator'
);

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    checked: Boolean,
    disabled: Boolean,
  },

  render(h, { props, data, slots }) {
    const Tag = 'div';

    return (
      <Tag
        class={bem({
          'is-checked': props.checked,
          'is-disabled': props.disabled,
        })}
        {...data}
      >
        <div class={bem('thumb')}>{slots()}</div>
      </Tag>
    );
  },
});
