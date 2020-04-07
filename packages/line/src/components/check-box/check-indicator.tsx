import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { getMode } from '@line-ui/line/src/utils/config';

const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'check-indicator'
);

export default /*#__PURE__*/ createComponent({
  functional: true,

  props: {
    checked: Boolean,
    indeterminate: Boolean,
    disabled: Boolean,
  },

  render(h, { props, data }) {
    const mode = getMode();
    const { checked, indeterminate, disabled } = props;

    let path = indeterminate ? (
      <path d="M6 12L18 12" />
    ) : (
      <path d="M5.9,12.5l3.8,3.8l8.8-8.8" />
    );

    if (mode === 'md') {
      path = indeterminate ? (
        <path d="M2 12H22" />
      ) : (
        <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
      );
    }

    return (
      <svg
        class={bem({
          checked,
          indeterminate,
          disabled,
        })}
        {...data}
      >
        {path}
      </svg>
    );
  },
});
