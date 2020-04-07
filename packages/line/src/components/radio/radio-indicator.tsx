import { createNamespace } from '@line-ui/line/src/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'radio-indicator'
);

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    checked: Boolean,
    disabled: Boolean,
  },

  render(h, { props, data }) {
    const { checked, disabled } = props;

    return (
      <div
        class={bem({
          checked,
          disabled,
        })}
        {...data}
      >
        <div class={bem('inner')} />
      </div>
    );
  },
});
