import { createNamespace } from 'skyline/src/utils/namespace';
import { useColor } from 'skyline/src/mixins/use-color';
import {
  createGesture,
  Gesture,
  GestureDetail,
} from 'skyline/src/utils/gesture';

import { isArray } from 'skyline/src/utils/helpers';
import { pointerCoord } from 'skyline/src/utils/dom';
import { config } from 'skyline/src/utils/config';
import { useCheckGroupWithModel } from 'skyline/src/mixins/use-check-group';

const NAMESPACE = 'Segment';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('segment');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useCheckGroupWithModel(NAMESPACE),
    /*#__PURE__*/ useColor(),
  ],

  inject : {
    Item : { default: undefined },
  },

  props : {
    disabled   : Boolean,
    scrollable : Boolean,
    exclusive  : {
      type    : Boolean,
      default : true,
    },
  },

  data() {
    return {
      activated      : false,
      inToolbar      : false,
      inToolbarColor : false,

      gesture : {} as Gesture,
      didInit : false,

      valueAfterGesture : null as any,
    };
  },

  async mounted() {
    await this.$nextTick();

    this.inToolbar = this.$el.closest('.line-toolbar') !== null;
    this.inToolbarColor = this.$el.closest('.line-toolbar.line-color') !== null;

    this.setCheckedClasses();

    this.gesture = createGesture({
      el              : this.$el,
      gestureName     : 'segment',
      gesturePriority : 100,
      threshold       : 0,
      passive         : false,
      onStart         : ev => this.onStart(ev),
      onMove          : ev => this.onMove(ev),
      onEnd           : ev => this.onEnd(ev),
    });
    this.gesture.enable(!this.scrollable);
    this.gestureChanged();

    // if (this.disabled) {
    //   this.disabledChanged();
    // }
    this.didInit = true;
  },

  methods : {
    disabledChanged() {
      this.gestureChanged();

      const { items } = this;
      for (const item of items) {
        item.disabled = this.disabled;
      }
    },

    gestureChanged() {
      if (this.gesture && !this.scrollable) {
        this.gesture.enable(!this.disabled);
      }
    },

    onStart(detail: GestureDetail) {
      this.activate(detail);
    },

    onMove(detail: GestureDetail) {
      this.setNextIndex(detail);
    },

    onEnd(detail: GestureDetail) {
      this.setActivated(false);

      const checkedValidButton = this.setNextIndex(detail, true);

      detail.event.stopImmediatePropagation();

      if (checkedValidButton) {
        // TODO
        // this.addRipple(detail);
      }
    },

    /**
     * The gesture blocks the segment button ripple. This
     * function adds the ripple based on the checked segment
     * and where the cursor ended.
     */
    addRipple(detail: GestureDetail) {
      const useRippleEffect = config.getBoolean('animated', true) && config.getBoolean('rippleEffect', true);
      if (!useRippleEffect) { return; }

      const { items } = this;
      const checked = items.find((item: any) => item.modelValue === this.value)!;

      const root = checked.shadowRoot || checked;
      const ripple = root.querySelector('.line-ripple-effect');

      if (!ripple) { return; }

      const { x, y } = pointerCoord(detail.event);

      ripple.addRipple(x, y).then((remove: any) => remove());
    },

    /*
    * Activate both the segment and the buttons
    * due to a bug with ::slotted in Safari
    */
    setActivated(activated: boolean) {
      const { items } = this;

      items.forEach((item: any) => {
        item.activated = activated;
      });
      this.activated = activated;
    },

    activate(detail: GestureDetail) {
      const { items, checkedItemValue } = this;
      const targetEl = detail.event.target as HTMLElement;
      const clicked = items.find((item: any) => item.$el === targetEl);

      // Make sure we are only checking for activation on a segment button
      // since disabled buttons will get the click on the segment
      if (clicked.$options.name !== 'line-segment-button') {
        return;
      }

      // If there are no checked buttons, set the current button to checked
      if ((isArray(checkedItemValue) && !checkedItemValue.length) || !checkedItemValue) {
        clicked.updateState();
      }

      // If the gesture began on the clicked button with the indicator
      // then we should activate the indicator
      if (this.checkedItemValue === clicked.modelValue) {
        this.setActivated(true);
      }
    },

    async checkButton(previous: any, current: any) {
      const previousIndicator = previous.indicatorEl;
      const currentIndicator = current.indicatorEl;

      if (previousIndicator === null || currentIndicator === null) {
        return;
      }

      const previousClientRect = previousIndicator.getBoundingClientRect();
      const currentClientRect = currentIndicator.getBoundingClientRect();

      const widthDelta = previousClientRect.width / currentClientRect.width;
      const xPosition = previousClientRect.left - currentClientRect.left;

      // Scale the indicator width to match the previous indicator width
      // and translate it on top of the previous indicator
      const transform = `translate3d(${ xPosition }px, 0, 0) scaleX(${ widthDelta })`;

      this.$nextTick(() => {
        // Remove the transition before positioning on top of the previous indicator
        currentIndicator.classList.remove('line-segment-button__indicator--animated');
        currentIndicator.style.setProperty('transform', transform);

        // Force a repaint to ensure the transform happens
        currentIndicator.getBoundingClientRect();

        // Add the transition to move the indicator into place
        currentIndicator.classList.add('line-segment-button__indicator--animated');

        // Remove the transform to slide the indicator back to the button clicked
        currentIndicator.style.setProperty('transform', '');
      });

      current.updateState();

      await this.$nextTick();
      this.setCheckedClasses();
    },

    setCheckedClasses() {
      const { items, checkedItem } = this;
      const index = items.findIndex((item: any) => item === checkedItem);
      const next = index + 1;

      for (const item of items) {
        item.afterChecked = false;
      }
      if (next < items.length) {
        items[next].afterChecked = true;
      }
    },

    setNextIndex(detail: GestureDetail, isEnd = false) {
      const isRTL = document.dir === 'rtl';
      const { activated } = this;
      const { items, checkedItem } = this;
      let index = 0;

      if (checkedItem || (isArray(checkedItem) && checkedItem.length)) {
        index = items.findIndex((item: any) => item === checkedItem);
      }

      if (index === -1) {
        return;
      }

      const previous = items[index];
      let current;
      let nextIndex;

      // Get the element that the touch event started on in case
      // it was the checked button, then we will move the indicator
      const rect = previous.$el.getBoundingClientRect() as DOMRect;
      const { left } = rect;
      const { width } = rect;

      // Get the element that the gesture is on top of based on the currentX of the
      // gesture event and the Y coordinate of the starting element, since the gesture
      // can move up and down off of the segment
      const { currentX } = detail;

      const previousY = rect.top + (rect.height / 2);
      const nextEl = document.elementFromPoint(currentX, previousY) as HTMLElement;

      const decreaseIndex = isRTL ? currentX > (left + width) : currentX < left;
      const increaseIndex = isRTL ? currentX < left : currentX > (left + width);

      // If the indicator is currently activated then we have started the gesture
      // on top of the checked button so we need to slide the indicator
      // by checking the button next to it as we move
      if (activated && !isEnd) {
        // Decrease index, move left in LTR & right in RTL
        if (decreaseIndex) {
          const newIndex = index - 1;

          if (newIndex >= 0) {
            nextIndex = newIndex;
          }
        // Increase index, moves right in LTR & left in RTL
        } else if (increaseIndex) {
          if (activated && !isEnd) {
            const newIndex = index + 1;

            if (newIndex < items.length) {
              nextIndex = newIndex;
            }
          }
        }

        if (nextIndex !== undefined && !items[nextIndex].disabled) {
          current = items[nextIndex];
        }
      }

      // If the indicator is not activated then we will just set the indicator
      // to the element where the gesture ended
      if (!activated && isEnd) {
        current = items.find((item: any) => item.$el === nextEl);
      }

      /* tslint:disable-next-line */
      if (current != null) {
        /**
         * If current element is line-segment then that means
         * user tried to select a disabled line-segment-button,
         * and we should not update the ripple.
         */
        if (current.$options.name === 'line-segment') {
          return false;
        }

        if (previous !== current) {
          this.checkButton(previous, current);
        }
      }

      return true;
    },

    emitStyle() {
      this.Item && this.Item.itemStyle(
        'segment',
        {
          segment : true,
        },
      );
    },

    onClick(ev: Event) {
      const { items } = this;

      const current = items.find((item: any) => item.$el === ev.target);
      const previous = this.checkedItem;

      if (!current) {
        return;
      }

      current.updateState();

      if (previous && this.scrollable) {
        this.checkButton(previous, current);
      }
    },
  },

  render() {
    const {
      inToolbar, inToolbarColor, activated, disabled, scrollable,
    } = this;

    return (
      <div
        class={[
          bem({
            activated,
            disabled,
            scrollable,
          }),
          {
            'in-toolbar'       : inToolbar,
            'in-toolbar-color' : inToolbarColor,
          },
        ]}
        onClick={this.onClick}
      >
        {this.slots()}
      </div>
    );
  },
});
