import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useCheckItemWithModel } from '@line-ui/line/src/mixins/use-check-item';

const NAMESPACE = 'Segment';
const { createComponent, bem } = /*#__PURE__*/ createNamespace(
  'segment-button'
);

export default /*#__PURE__*/ createComponent({
  mixins: [/*#__PURE__*/ useCheckItemWithModel(NAMESPACE)],

  props: {
    layout: {
      type: String,
      default: 'icon-top',
    },
    type: {
      type: String,
      default: 'button',
    },
  },

  data() {
    return {
      activated: false,
      afterChecked: false,

      inToolbar: false,
      inToolbarColor: false,
      inSegment: false,
      inSegmentColor: false,
      hasLabel: false,
      hasIcon: false,
    };
  },

  async mounted() {
    const { $el } = this;

    this.inToolbar = $el.closest('.line-toolbar') !== null;
    this.inToolbarColor = $el.closest('.line-toolbar.line-color') !== null;
    this.inSegment = $el.closest('.line-segment') !== null;
    this.inSegmentColor = $el.closest('.line-segment.line-color') !== null;

    this.hasLabel = $el && !!$el.querySelector('.line-label');
    this.hasIcon = $el && !!$el.querySelector('.line-icon');

    this.indicatorEl = this.$refs.indicatorEl;
  },

  methods: {
    updateState() {
      this.checked = true;
    },
  },

  render() {
    const {
      mode,
      checked,
      type,
      disabled,
      activated,
      afterChecked,
      hasIcon,
      hasLabel,
      layout,
      inToolbar,
      inToolbarColor,
      inSegment,
      inSegmentColor,
    } = this;

    return (
      <div
        aria-disabled={disabled ? 'true' : null}
        class={[
          bem({
            'has-label': hasLabel,
            'has-icon': hasIcon,
            'has-label-only': hasLabel && !hasIcon,
            'has-icon-only': hasIcon && !hasLabel,
            'after-checked': afterChecked,
            [`layout-${layout}`]: true,
            disabled,
            checked,
            activated,
          }),
          {
            'in-toolbar': inToolbar,
            'in-toolbar-color': inToolbarColor,
            'in-segment': inSegment,
            'in-segment-color': inSegmentColor,
            'line-activatable': true,
            'line-activatable-instant': true,
            'line-focusable': true,
          },
        ]}
      >
        <button
          type={type}
          aria-pressed={checked ? 'true' : null}
          class={bem('button-native')}
          disabled={disabled}
        >
          <span class={bem('button-inner')}>{this.slots()}</span>
          {mode === 'md' && <line-ripple-effect></line-ripple-effect>}
        </button>
        <div
          part="indicator"
          class={bem('indicator', { animated: true })}
          ref="indicatorEl"
        >
          <div
            part="indicator-background"
            class={bem('indicator-background')}
          ></div>
        </div>
      </div>
    );
  },
});
