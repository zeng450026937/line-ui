// import SwitchIndicator from 'skyline/src/components/switch/switch-indicator';
import { useColor } from 'skyline/src/mixins/use-color';
import { useCheckItem } from 'skyline/src/mixins/use-check-item';
import { createNamespace } from 'skyline/src/utils/namespace';
import {
  createGesture,
  Gesture,
  GestureDetail,
} from 'skyline/src/utils/gesture';

const NAMESPACE = 'SwitchGroup';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('switch');

let gesture: Gesture | undefined;

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckItem(NAMESPACE),
    /*#__PURE__*/ useColor(),
  ],

  data() {
    return {
      gesture,
      lastDrag  : 0,
      activated : false,
    };
  },

  methods : {
    onClick() {
      if (this.lastDrag + 300 < Date.now()) {
        this.checked = !this.checked;
      }
    },
    onStart() {
      this.activated = true;

      // touch-action does not work in iOS
      this.setFocus();
    },

    onMove(detail: GestureDetail) {
      if (this.shouldToggle(document, this.checked, detail.deltaX, -10)) {
        this.checked = !this.checked;
        // TODO
        // hapticSelection();
      }
    },

    onEnd(ev: GestureDetail) {
      this.activated = false;
      this.lastDrag = Date.now();
      ev.event.preventDefault();
      ev.event.stopImmediatePropagation();
    },

    shouldToggle(doc: HTMLDocument, checked: boolean, deltaX: number, margin: number): boolean {
      const isRTL = doc.dir === 'rtl';

      if (checked) {
        return (!isRTL && (margin > deltaX))
          || (isRTL && (-margin < deltaX));
      }
      return (!isRTL && (-margin < deltaX))
          || (isRTL && (margin > deltaX));
    },

    emitStyle() {
      if (!this.Item) return;

      this.Item.itemStyle(
        'switch',
        { 'interactive-disabled': this.disabled },
      );
    },

    setFocus() {
      if (this.buttonEl) {
        this.buttonEl.focus();
      }
    },

    disabledChanged() {
      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    },
  },

  async mounted() {
    this.buttonEl = this.$refs.buttonEl;

    this.gesture = createGesture({
      el              : this.$el,
      gestureName     : 'toggle',
      gesturePriority : 100,
      threshold       : 5,
      passive         : false,
      onStart         : () => this.onStart(),
      onMove          : ev => this.onMove(ev),
      onEnd           : ev => this.onEnd(ev),
    });
    this.disabledChanged();
    this.emitStyle();
  },

  destroyed() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  },

  watch : {
    disabled() {
      this.emitStyle();
      this.disabledChanged();
    },

    checked() {
      this.emitStyle();
    },
  },

  render() {
    const {
      checked, disabled, activated,
    } = this;
    return (
      <div
        role="checkbox"
        class={
          bem({
            disabled,
            checked,
            activated,
          })
        }
        onClick={this.onClick}
        on={this.$listeners}
      >
        <div class={bem('icon')}>
          <div class={bem('inner')}/>
        </div>
        <button
          type="button"
          disabled={disabled}
          ref="buttonEl"
        >
        </button>
      </div>
    );
  },

});
