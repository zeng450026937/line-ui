import { createNamespace } from 'skyline/src/utils/namespace';
import { useCheckItemWithModel } from 'skyline/src/mixins/use-check-item';

const NAMESPACE = 'Segment';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('segment-button');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItemWithModel(NAMESPACE),
  ],

  props : {
    layout : {
      type    : String,
      default : 'icon-top',
    },
    type : {
      type    : String,
      default : 'button',
    },
  },

  data() {
    return {
      activated    : false,
      afterChecked : false,

      inToolbar      : false,
      inToolbarColor : false,
      inSegment      : false,
      inSegmentColor : false,
      hasLabel       : false,
      hasIcon        : false,
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

  methods : {
    updateState() {
      this.checked = true;
    },
  },

  render() {
    const {
      mode, checked, type, disabled, activated, afterChecked, hasIcon, hasLabel,
      layout, inToolbar, inToolbarColor, inSegment, inSegmentColor,
    } = this;

    return (
      <div
      aria-disabled={disabled ? 'true' : null}
        class={[bem(), {
          'in-toolbar'                          : inToolbar,
          'in-toolbar-color'                    : inToolbarColor,
          'in-segment'                          : inSegment,
          'in-segment-color'                    : inSegmentColor,
          'segment-button-has-label'            : hasLabel,
          'segment-button-has-icon'             : hasIcon,
          'segment-button-has-label-only'       : hasLabel && !hasIcon,
          'segment-button-has-icon-only'        : hasIcon && !hasLabel,
          'segment-button-disabled'             : disabled,
          'segment-button-after-checked'        : afterChecked,
          'segment-button-checked'              : checked,
          'segment-button-activated'            : activated,
          [`segment-button-layout-${ layout }`] : true,
          'line-activatable'                    : true,
          'line-activatable-instant'            : true,
          'line-focusable'                      : true,
        }]}
      >
        <button
          type={type}
          aria-pressed={checked ? 'true' : null}
          class="button-native"
          disabled={disabled}
        >
          <span class="button-inner">
            {this.slots()}
          </span>
          {mode === 'md' && <line-ripple-effect></line-ripple-effect>}
        </button>
        <div
          part="indicator"
          class={{
            'segment-button-indicator'          : true,
            'segment-button-indicator-animated' : true,
          }}
          ref="indicatorEl"
        >
          <div part="indicator-background" class="segment-button-indicator-background"></div>
        </div>
      </div>
    );
  },
});
