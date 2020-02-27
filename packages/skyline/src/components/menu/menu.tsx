import {
  Animation, Gesture, GestureDetail, Side,
} from 'skyline/types/interface.d';
import { assert, clamp, isEndSide as isEnd } from 'skyline/utils/helpers';
import { createGesture, GESTURE_CONTROLLER } from 'skyline/utils/gesture';
import { menuController } from 'skyline/utils/menu-controller/index';
import { getTimeGivenProgression } from 'skyline/utils/animation/cubic-bezier';

import { useModel } from 'skyline/mixins/use-model';
import { createNamespace } from 'skyline/utils/namespace';
import 'skyline/components/menu/menu.scss';
import 'skyline/components/menu/menu.ios.scss';

import { Overlay } from 'skyline/components/overlay';

const [createComponent, bem] = createNamespace('menu');

const iosEasing = 'cubic-bezier(0.32,0.72,0,1)';
const mdEasing = 'cubic-bezier(0.0,0.0,0.2,1)';
const iosEasingReverse = 'cubic-bezier(1, 0, 0.68, 0.28)';
const mdEasingReverse = 'cubic-bezier(0.4, 0, 0.6, 1)';

const computeDelta = (
  deltaX: number,
  isOpen: boolean,
  isEndSide: boolean,
): number => {
  return Math.max(0, isOpen !== isEndSide ? -deltaX : deltaX);
};

const checkEdgeSide = (
  win: Window,
  posX: number,
  isEndSide: boolean,
  maxEdgeStart: number,
): boolean => {
  if (isEndSide) {
    return posX >= win.innerWidth - maxEdgeStart;
  }
  return posX <= maxEdgeStart;
};

const SHOW_MENU = 'show-menu';
const SHOW_BACKDROP = 'show-overlay';
const MENU_CONTENT_OPEN = 'menu-content-open';


export default createComponent({
  mixins : [
    useModel('actived'),
  ],

  props : {
    contentId : {
      type     : String,
      required : true,
    },
    type : {
      type    : String,
      default : 'overlay',
    },
    maxEdgeStart : {
      type    : Number,
      default : 50,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
    side : {
      type    : String,
      default : 'start',
    },
    swipeGesture : {
      type    : Boolean,
      default : true,
    },
  },

  data() {
    // TODO  mode ios/md
    const easing: string = iosEasing;
    const easingReverse: string = iosEasingReverse;

    // let animation: any;
    // let gesture: Gesture;
    // let backdropEl: HTMLElement;
    // let menuInnerEl: HTMLElement;
    // let contentEl: HTMLElement;

    return {
      lastOnEnd : 0,
      blocker   : GESTURE_CONTROLLER.createBlocker({ disableScroll: true }),

      isPaneVisible : false,
      isEndSide     : false,
      isAnimating   : false,
      _isOpen       : false,

      visible : false,

      easing,
      easingReverse,
    };
  },

  methods : {
    onBackdropClick(ev: any) {
      if (this._isOpen) {
        // TODO
        // && this.lastOnEnd < ev.timeStamp - 100
        const shouldClose = (ev.composedPath)
          ? !ev.composedPath().includes(this.menuInnerEl)
          : false;

        if (shouldClose) {
          ev.preventDefault();
          ev.stopPropagation();
          this.close();
        }
      }
    },

    /**
   * Returns `true` is the menu is open.
   */
    isOpen(): Promise<boolean> {
      return Promise.resolve(this._isOpen);
    },

    /**
   * Returns `true` is the menu is active.
   */
    isActive(): Promise<boolean> {
      return Promise.resolve(this._isActive());
    },

    /**
   * Opens the menu. If the menu is already open or it can't be opened,
   * it returns `false`.
   */
    open(animated = true): Promise<boolean> {
      return this.setOpen(true, animated);
    },

    /**
   * Closes the menu. If the menu is already closed or it can't be closed,
   * it returns `false`.
   */
    close(animated = true): Promise<boolean> {
      return this.setOpen(false, animated);
    },

    toggle(animated = true): Promise<boolean> {
      return this.setOpen(!this._isOpen, animated);
    },

    async setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
      // return this._setOpen(shouldOpen, animated);
      // },

      // async _setOpen(shouldOpen: boolean, animated = true): Promise<boolean> {
      // If the menu is disabled or it is currently being animated, let's do nothing
      if (!this._isActive() || this.isAnimating || shouldOpen === this._isOpen) {
        return false;
      }

      this.beforeAnimation(shouldOpen);
      await this.loadAnimation();
      await this.startAnimation(shouldOpen, animated);
      this.afterAnimation(shouldOpen);

      return true;
    },

    async loadAnimation(): Promise<void> {
      // Menu swipe animation takes the menu's inner width as parameter,
      // If `offsetWidth` changes, we need to create a new animation.
      const width = this.menuInnerEl!.offsetWidth;
      if (width === this.width && this.animation !== undefined) {
        return;
      }
      this.width = width;

      // Destroy existing animation
      if (this.animation) {
        this.animation.destroy();
        this.animation = undefined;
      }
      // Create new animation
      this.animation = await menuController._createAnimation(this.type!, this as any);

      // TODO global animated: false
      // if (!config.getBoolean('animated', true)) {
      //   this.animation.duration(0);
      // }
      this.animation.fill('both');
    },

    async startAnimation(shouldOpen: boolean, animated: boolean): Promise<void> {
      const isReversed = !shouldOpen;

      // type and value concurrent change, animation = undefined
      if (!this.animation) await this.loadAnimation();

      const ani = (this.animation as Animation)!
        .direction((isReversed) ? 'reverse' : 'normal')
        .easing((isReversed) ? this.easingReverse : this.easing)
        .onFinish(() => {
          if (ani.getDirection() === 'reverse') {
            ani.direction('normal');
          }
        });

      if (animated) {
        await ani.play();
      } else {
        ani.play({ sync: true });
      }
    },

    _isActive() {
      return !this.disabled && !this.isPaneVisible;
    },

    canSwipe(): boolean {
      return this.swipeGesture && !this.isAnimating && this._isActive();
    },

    canStart(detail: GestureDetail): boolean {
      // Do not allow swipe gesture if a modal is open

      // TODO isModalPresented
      // const isModalPresented = !!document.querySelector('ion-modal.show-modal');
      if (!this.canSwipe()) {
        return false;
      }
      if (this._isOpen) {
        return true;
      // TODO error
      }
      // TODO
      // if (menuController._getOpenSync()) {
      //   return false;
      // }
      return checkEdgeSide(
        window,
        detail.currentX,
        this.isEndSide,
        this.maxEdgeStart,
      );
    },

    onWillStart(): Promise<void> {
      this.beforeAnimation(!this._isOpen);
      return this.loadAnimation();
    },

    onStart() {
      if (!this.isAnimating || !this.animation) {
        assert(false, 'isAnimating has to be true');
        return;
      }

      // the cloned animation should not use an easing curve during seek
      (this.animation as Animation).progressStart(true, (this._isOpen ? 1 : 0));
    },

    onMove(detail: GestureDetail) {
      if (!this.isAnimating || !this.animation) {
        assert(false, 'isAnimating has to be true');
        return;
      }

      const delta = computeDelta(detail.deltaX, this._isOpen, this.isEndSide);
      const stepValue = delta / this.width;

      this.animation.progressStep((this._isOpen) ? 1 - stepValue : stepValue);
    },

    onEnd(detail: GestureDetail) {
      if (!this.isAnimating || !this.animation) {
        assert(false, 'isAnimating has to be true');
        return;
      }
      const isOpen = this._isOpen;
      const { isEndSide } = this;
      const delta = computeDelta(detail.deltaX, isOpen, isEndSide);
      const { width } = this;
      const stepValue = delta / width;
      const velocity = detail.velocityX;
      const z = width / 2.0;
      const shouldCompleteRight = velocity >= 0 && (velocity > 0.2 || detail.deltaX > z);

      const shouldCompleteLeft = velocity <= 0 && (velocity < -0.2 || detail.deltaX < -z);

      const shouldComplete = isOpen
        ? isEndSide ? shouldCompleteRight : shouldCompleteLeft
        : isEndSide ? shouldCompleteLeft : shouldCompleteRight;

      let shouldOpen = !isOpen && shouldComplete;
      if (isOpen && !shouldComplete) {
        shouldOpen = true;
      }

      this.lastOnEnd = detail.currentTime;

      // Account for rounding errors in JS
      let newStepValue = (shouldComplete) ? 0.001 : -0.001;

      /**
       * TODO: stepValue can sometimes return a negative
       * value, but you can't have a negative time value
       * for the cubic bezier curve (at least with web animations)
       * Not sure if the negative step value is an error or not
       */
      const adjustedStepValue = (stepValue < 0) ? 0.01 : stepValue;

      /**
       * Animation will be reversed here, so need to
       * reverse the easing curve as well
       *
       * Additionally, we need to account for the time relative
       * to the new easing curve, as `stepValue` is going to be given
       * in terms of a linear curve.
       */
      newStepValue += getTimeGivenProgression(
        [0, 0], [0.4, 0], [0.6, 1], [1, 1], clamp(0, adjustedStepValue, 0.9999),
      )[0] || 0;

      const playTo = (this._isOpen) ? !shouldComplete : shouldComplete;

      this.animation
        .easing('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .onFinish(
          () => this.afterAnimation(shouldOpen),
          { oneTimeCallback: true },
        )
        .progressEnd((playTo) ? 1 : 0, (this._isOpen) ? 1 - newStepValue : newStepValue, 300);
    },

    beforeAnimation(shouldOpen: boolean) {
      assert(!this.isAnimating, '_before() should not be called while animating');

      // this places the menu into the correct location before it animates in
      // this css class doesn't actually kick off any animations
      this.$el.classList.add(SHOW_MENU);
      this.visible = true;

      this.blocker.block();
      this.isAnimating = true;
      if (shouldOpen) {
        // TODO
        // this.ionWillOpen.emit();
        this.$emit('lineWillOpen');
      } else {
        // TODO
        // this.ionWillClose.emit();
        this.$emit('lineWillClose');
      }
    },

    afterAnimation(isOpen: boolean) {
      assert(this.isAnimating, '_before() should be called while animating');

      // keep opening/closing the menu disabled for a touch more yet
      // only add listeners/css if it's enabled and isOpen
      // and only remove listeners/css if it's not open
      // emit opened/closed events
      this._isOpen = isOpen;
      this.actived = isOpen;

      this.isAnimating = false;
      if (!this._isOpen) {
        this.blocker.unblock();
      }

      if (isOpen) {
        // add css class
        if (this.contentEl) {
          this.contentEl.classList.add(MENU_CONTENT_OPEN);
        }

        // TODO
        // emit open event
        // this.ionDidOpen.emit();
        this.$emit('open');
      } else {
        // remove css classes
        this.$el.classList.remove(SHOW_MENU);
        if (this.contentEl) {
          this.contentEl.classList.remove(MENU_CONTENT_OPEN);
        }

        this.visible = false;

        if (this.animation) {
          this.animation.stop();
        }

        // TODO
        // emit close event
        // this.ionDidClose.emit();
        this.$emit('close');
      }
    },

    updateState() {
      const isActive = this._isActive();
      if (this.gesture) {
        this.gesture.enable(isActive && this.swipeGesture);
      }

      // Close menu immediately
      if (!isActive && this._isOpen) {
        // close if this menu is open, and should not be enabled
        this.forceClosing();
      }

      // if (!this.disabled) {
      //   menuController._setActiveMenu(this);
      // }
      assert(!this.isAnimating, 'can not be animating');
    },

    forceClosing() {
      assert(this._isOpen, 'menu cannot be closed');

      this.isAnimating = true;

      const ani = (this.animation as Animation)!.direction('reverse');
      ani.play({ sync: true });

      this.afterAnimation(false);
    },

    typeChanged(value, oldValue) {
      const { contentEl } = this;
      this.animation = undefined;
      if (contentEl) {
        if (oldValue !== undefined) {
          contentEl.classList.remove(`menu-content-${ oldValue }`);
        }
        contentEl.classList.add(`menu-content-${ value }`);
        contentEl.removeAttribute('style');
      }
      if (this.menuInnerEl) {
        // Remove effects of previous animations
        this.menuInnerEl.removeAttribute('style');
      }
    },

    sideChanged() {
      this.isEndSide = isEnd(this.side as Side);
    },
  },

  watch : {
    type(value, oldValue) {
      this.typeChanged(value, oldValue);
    },

    disabled() {
      this.updateState();
    },

    side() {
      this.sideChanged();
    },

    actived(val, old) {
      if (val) {
        this.open();
      }
    },

  },

  async mounted() {
    // TODO isBrowser
    // if (!Build.isBrowser) {
    //   this.disabled = true;
    //   return;
    // }

    const { menuInnerEl, backdropEl } = this.$refs;
    const parent = this.$el.parentNode as any;

    this.menuInnerEl = (menuInnerEl as HTMLElement);
    this.backdropEl = (backdropEl as any).$el;

    if (this.contentId === undefined) {
      console.warn(`[DEPRECATED][line-menu] Using the [main] attribute is deprecated, please use the "contentId" property instead:
      BEFORE:
        <line-menu>...</line-menu>
        <div main>...</div>

      AFTER:
        <line-menu contentId="main-content"></line-menu>
        <div id="main-content">...</div>
      `);
    }
    const content = this.contentId !== undefined
      ? document.getElementById(this.contentId)
      : parent && parent.querySelector && parent.querySelector('[main]');

    if (!content || !content.tagName) {
      // requires content element
      console.error('Menu: must have a "content" element to listen for drag events on.');
      return;
    }
    this.contentEl = content as HTMLElement;

    // add menu's content classes
    content.classList.add('menu-content');


    if (!content || !(content as HTMLElement).tagName) {
      // requires content element
      console.error('Menu: must have a "content" element to listen for drag events on.');
      return;
    }
    this.contentEl = content as HTMLElement;

    // add menu's content classes
    (content as HTMLElement).classList.add('menu-content');

    this.typeChanged(this.type!, undefined);
    this.sideChanged();

    // TODO
    // register this menu with the app's menu controller
    // menuController._register(this);

    this.gesture = createGesture({
      el              : document,
      gestureName     : 'menu-swipe',
      gesturePriority : 30,
      threshold       : 10,
      canStart        : ev => this.canStart(ev),
      onWillStart     : () => this.onWillStart(),
      onStart         : () => this.onStart(),
      onMove          : ev => this.onMove(ev),
      onEnd           : ev => this.onEnd(ev),
    });
    this.updateState();

    // on Backdrop Click
    document.addEventListener('click', this.onBackdropClick);
  },

  beforeDestroy() {
    document.removeEventListener('click', this.onBackdropClick);
  },

  destroyed() {
    this.blocker.destroy();
    if (this.animation) {
      this.animation.destroy();
    }
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }

    this.animation = undefined;
    this.contentEl = this.backdropEl = this.menuInnerEl = undefined;
  },

  render() {
    const {
      isEndSide, type, disabled, isPaneVisible, visible,
    } = this;

    return (
      <div
        class={[
          bem(),
          {
            [`menu-type-${ type }`] : true,
            'show-menu'             : visible,
            'menu-enabled'          : !disabled,
            'menu-side-end'         : isEndSide,
            'menu-side-start'       : !isEndSide,
            'menu-pane-visible'     : isPaneVisible,
          }]}
      >
        <div
          class="menu-inner"
          ref="menuInnerEl"
        >
          {this.slots()}
        </div>

        <Overlay
          ref="backdropEl"
          class={{
            'menu-backdrop' : true,
            'show-overlay'  : visible,
          }}
          visible={visible}
          tappable={false}
          stopPropagation={false}
        />
      </div>
    );
  },
});
