// import SwitchIndicator from 'skyline/components/switch/switch-indicator';
import { createColorClasses, useColor } from 'skyline/mixins/use-color';
import { useCheckItem } from 'skyline/mixins/use-check-item';
import { createNamespace } from 'skyline/utils/namespace';
import { createGesture, Gesture, GestureDetail } from 'skyline/utils/gesture';

const NAMESPACE = 'SwitchGroup';
const [createComponent, bem] = createNamespace('switch');

let gesture: Gesture | undefined;

export default /*#__PURE__*/ createComponent({
  mixins : [useCheckItem(NAMESPACE), useColor()],

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
      // this.setFocus();
    },

    onMove(detail: GestureDetail) {
      if (this.shouldToggle(document, this.checked, detail.deltaX, -10)) {
        this.checked = !this.checked;
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

    disabledChanged() {
      // this.emitStyle();
      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    },
  },

  async mounted() {
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
  },

  destroyed() {
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  },

  watch : {
    disabled() {
      this.disabledChanged();
    },
  },

  render() {
    const {
      checked, disabled, activated, color,
    } = this;
    return (
      <div
        role="checkbox"
        class={[
          bem({
            disabled,
            checked,
            activated,
          }),
          { ...createColorClasses(color) },
        ]}
        onClick={this.onClick}
        on={this.$listeners}
      >
        <div class={bem('icon')}>
          <div class={bem('inner')}/>
        </div>
        <button
          type="button"
          disabled={disabled}
        >
        </button>
      </div>
    );
  },

});
