import { createNamespace } from 'skyline/utils/namespace';
import { Animation, GestureDetail } from 'skyline/types/interface.d';
import { createGesture } from 'skyline/utils/gesture';
import { getTimeGivenProgression } from 'skyline/utils/animation/cubic-bezier';

import {
  createPullingAnimation, createSnapBackAnimation, getRefresherAnimationType,
  handleScrollWhilePulling, handleScrollWhileRefreshing, setSpinnerOpacity,
  shouldUseNativeRefresher, transitionEndAsync, translateElement,
} from './refresher.utils';


const { createComponent, bem } = /*#__PURE__*/ createNamespace('refresher');

const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

const enum RefresherState {
  Inactive = 1 << 0,
  Pulling = 1 << 1,
  Ready = 1 << 2,
  Refreshing = 1 << 3,
  Cancelling = 1 << 4,
  Completing = 1 << 5,

  _BUSY_ = Refreshing | Cancelling | Completing,
}


export default /*#__PURE__*/ createComponent({
  props : {
    pullMin : {
      type    : Number,
      default : 60,
    },
    pullMax : {
      type    : Number,
      default : 120,
    },
    closeDuration : {
      type    : String,
      default : '280ms',
    },
    snapbackDuration : {
      type    : String,
      default : '280ms',
    },
    pullFactor : {
      type    : Number,
      default : 1,
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  data() {
    let scrollListenerCallback: any;

    return {
      appliedStyles : false,
      didStart      : false,
      progress      : 0,

      scrollListenerCallback,

      pointerDown     : false,
      needsCompletion : false,
      didRefresh      : false,
      lastVelocityY   : 0,

      nativeRefresher : false,
      state           : RefresherState.Inactive,
    };
  },

  computed : {
    style() {
      const style = {
        transform             : `translate3d(0, ${ this.top }px, 0)`,
        'transition-duration' : '',
      };
      if (!this.touching) {
        style['transition-duration'] = '300ms';
      }

      return style;
    },
    down() {
      return this.state === 0;
    },
    up() {
      return this.state === 1;
    },
    refresher() {
      return this.state === 2;
    },
  },

  methods : {
    checkNativeRefresher() {
      const { mode } = this;
      const useNativeRefresher = shouldUseNativeRefresher(this.$el as HTMLElement, mode);
      if (useNativeRefresher && !this.nativeRefresher) {
        const contentEl = this.$parent.$options.name === 'line-content' ? this.$parent.$el : null;
        this.setupNativeRefresher(contentEl as HTMLElement);
      } else if (!useNativeRefresher) {
        this.destroyNativeRefresher();
      }
    },

    destroyNativeRefresher() {
      if (this.scrollEl && this.scrollListenerCallback) {
        this.scrollEl.removeEventListener('scroll', this.scrollListenerCallback);
        this.scrollListenerCallback = undefined;
      }

      this.nativeRefresher = false;
    },

    async resetNativeRefresher(el: HTMLElement | undefined, state: RefresherState) {
      this.state = state;
      const { mode } = this;

      if (mode === 'ios') {
        await translateElement(el, undefined);
      } else {
        await transitionEndAsync(this.$el.querySelector('.refresher-refreshing-icon'));
      }

      this.didRefresh = false;
      this.needsCompletion = false;
      this.pointerDown = false;
      this.animations.forEach((ani: any) => (ani as any).destroy());
      this.animations = [];
      this.progress = 0;

      this.state = RefresherState.Inactive;
    },

    async setupiOSNativeRefresher(pullingSpinner: HTMLElement, refreshingSpinner: HTMLElement) {
      this.elementToTransform = this.scrollEl;
      const ticks = pullingSpinner && pullingSpinner.shadowRoot!.querySelectorAll('svg');
      const MAX_PULL = this.scrollEl.clientHeight * 0.16;
      const NUM_TICKS = ticks.length;

      this.$nextTick(() => ticks.forEach(el => el.style.setProperty('animation', 'none')));

      this.scrollListenerCallback = () => {
        // If pointer is not on screen or refresher is not active, ignore scroll
        if (!this.pointerDown && this.state === RefresherState.Inactive) { return; }

        this.$nextTick(() => {
          // PTR should only be active when overflow scrolling at the top
          const { scrollTop } = this.scrollEl;
          const refresherHeight = this.$el.clientHeight;

          if (scrollTop > 0) {
            /**
             * If refresher is refreshing and user tries to scroll
             * progressively fade refresher out/in
             */
            if (this.state === RefresherState.Refreshing) {
              const ratio = clamp(0, scrollTop / (refresherHeight * 0.5), 1);
              this.$nextTick(() => setSpinnerOpacity(refreshingSpinner, 1 - ratio));
              return;
            }

            this.$nextTick(() => setSpinnerOpacity(pullingSpinner, 0));
            return;
          }

          if (this.pointerDown) {
            if (!this.didStart) {
              this.didStart = true;
              this.$emit('start');
            }

            // emit "pulling" on every move
            if (this.pointerDown) {
              this.$emit('pull');
            }
          }

          // delay showing the next tick marks until user has pulled 30px
          const opacity = clamp(0, Math.abs(scrollTop) / refresherHeight, 0.99);
          const pullAmount = this.progress = clamp(0, (Math.abs(scrollTop) - 30) / MAX_PULL, 1);
          const currentTickToShow = clamp(0, Math.floor(pullAmount * NUM_TICKS), NUM_TICKS - 1);
          const shouldShowRefreshingSpinner = this.state
            === RefresherState.Refreshing || currentTickToShow === NUM_TICKS - 1;

          if (shouldShowRefreshingSpinner) {
            if (this.pointerDown) {
              handleScrollWhileRefreshing(refreshingSpinner, this.lastVelocityY);
            }

            if (!this.didRefresh) {
              this.beginRefresh();
              this.didRefresh = true;
              // hapticImpact({ style: 'light' });

              /**
               * Translate the content element otherwise when pointer is removed
               * from screen the scroll content will bounce back over the refresher
               */
              if (!this.pointerDown) {
                translateElement(this.elementToTransform, `${ refresherHeight }px`);
              }
            }
          } else {
            this.state = RefresherState.Pulling;
            handleScrollWhilePulling(pullingSpinner, ticks, opacity, currentTickToShow);
          }
        });
      };

      this.scrollEl.addEventListener('scroll', this.scrollListenerCallback);

      this.gesture = createGesture({
        el              : this.scrollEl,
        gestureName     : 'refresher',
        gesturePriority : 10,
        direction       : 'y',
        threshold       : 5,
        onStart         : () => {
          this.pointerDown = true;

          if (!this.didRefresh) {
            translateElement(this.elementToTransform, '0px');
          }
        },
        onMove : ev => {
          this.lastVelocityY = ev.velocityY;
        },
        onEnd : () => {
          this.pointerDown = false;
          this.didStart = false;

          if (this.needsCompletion) {
            this.resetNativeRefresher(this.elementToTransform, RefresherState.Completing);
            this.needsCompletion = false;
          } else if (this.didRefresh) {
            this.$nextTick(() => translateElement(this.elementToTransform, `${ this.$el.clientHeight }px`));
          }
        },
      });

      this.disabledChanged();
    },

    async setupMDNativeRefresher(contentEl: HTMLElement, pullingSpinner: HTMLElement, refreshingSpinner: HTMLElement) {
      const circle = pullingSpinner && pullingSpinner.shadowRoot!.querySelector('circle');
      const pullingRefresherIcon = this.$el.querySelector('.line-refresher-content .refresher-pulling-icon') as HTMLElement;
      const refreshingCircle = refreshingSpinner && refreshingSpinner.shadowRoot!.querySelector('circle');

      if (circle !== null && refreshingCircle !== null) {
        this.$nextTick(() => {
          circle.style.setProperty('animation', 'none');

          // This lines up the animation on the refreshing spinner with the pulling spinner
          refreshingSpinner.style.setProperty('animation-delay', '-655ms');
          refreshingCircle.style.setProperty('animation-delay', '-655ms');
        });
      }

      this.gesture = createGesture({
        el              : this.scrollEl,
        gestureName     : 'refresher',
        gesturePriority : 10,
        direction       : 'y',
        threshold       : 5,
        canStart        : () => this.state !== RefresherState.Refreshing
          && this.state !== RefresherState.Completing && this.scrollEl.scrollTop === 0,
        onStart : (ev: GestureDetail) => {
          ev.data = { animation: undefined, didStart: false, cancelled: false };
        },
        onMove : (ev: GestureDetail) => {
          if ((ev.velocityY < 0 && this.progress === 0 && !ev.data.didStart) || ev.data.cancelled) {
            ev.data.cancelled = true;
            return;
          }

          if (!ev.data.didStart) {
            ev.data.didStart = true;

            this.state = RefresherState.Pulling;

            this.$nextTick(() => {
              const animationType = getRefresherAnimationType(contentEl);
              const animation = createPullingAnimation(animationType, pullingRefresherIcon);
              ev.data.animation = animation;

              this.scrollEl.style.setProperty('--overflow', 'hidden');

              animation.progressStart(false, 0);
              this.$emit('start');
              this.animations.push(animation);
            });

            return;
          }

          // Since we are using an easing curve, slow the gesture tracking down a bit
          this.progress = clamp(0, (ev.deltaY / 180) * 0.5, 1);
          ev.data.animation.progressStep(this.progress);
          this.$emit('pull');
        },
        onEnd : (ev: GestureDetail) => {
          if (!ev.data.didStart) { return; }

          this.$nextTick(() => this.scrollEl.style.removeProperty('--overflow'));
          if (this.progress <= 0.4) {
            this.gesture.enable(false);

            ev.data.animation
              .progressEnd(0, this.progress, 500)
              .onFinish(() => {
                this.animations.forEach((ani: any) => (ani as Animation).destroy());
                this.animations = [];
                this.gesture.enable(true);
                this.state = RefresherState.Inactive;
              });
            return;
          }

          const progress = getTimeGivenProgression([0, 0], [0, 0], [1, 1], [1, 1], this.progress)[0];
          const snapBackAnimation = createSnapBackAnimation(pullingRefresherIcon);
          this.animations.push(snapBackAnimation);

          this.$nextTick(async () => {
            pullingRefresherIcon.style.setProperty('--ion-pulling-refresher-translate', `${ (progress * 100) }px`);
            ev.data.animation.progressEnd();
            await snapBackAnimation.play();
            this.beginRefresh();
            ev.data.animation.destroy();
          });
        },
      });

      this.disabledChanged();
    },

    async setupNativeRefresher(contentEl: HTMLElement | null) {
      if (this.scrollListenerCallback || !contentEl || this.nativeRefresher || !this.scrollEl) {
        return;
      }

      this.nativeRefresher = true;

      const pullingSpinner = this.$el.querySelector('.line-refresher-content .refresher-pulling .line-spinner') as HTMLElement;
      const refreshingSpinner = this.$el.querySelector('.line-refresher-content .refresher-refreshing .line-spinner') as HTMLElement;

      const { mode } = this;
      if (mode === 'ios') {
        this.setupiOSNativeRefresher(pullingSpinner, refreshingSpinner);
      } else {
        this.setupMDNativeRefresher(contentEl, pullingSpinner, refreshingSpinner);
      }
    },

    /**
     * Call `complete()` when your async operation has completed.
     * For example, the `refreshing` state is while the app is performing
     * an asynchronous operation, such as receiving more data from an
     * AJAX request. Once the data has been received, you then call this
     * method to signify that the refreshing has completed and to close
     * the refresher. This method also changes the refresher's state from
     * `refreshing` to `completing`.
     */
    async complete() {
      if (this.nativeRefresher) {
        this.needsCompletion = true;

        // Do not reset scroll el until user removes pointer from screen
        if (!this.pointerDown) {
          this.resetNativeRefresher(this.elementToTransform, RefresherState.Completing);
        }
      } else {
        this.close(RefresherState.Completing, '120ms');
      }
    },

    /**
     * Changes the refresher's state from `refreshing` to `cancelling`.
     */
    async cancel() {
      if (this.nativeRefresher) {
      // Do not reset scroll el until user removes pointer from screen
        if (!this.pointerDown) {
          this.resetNativeRefresher(this.elementToTransform, RefresherState.Cancelling);
        }
      } else {
        this.close(RefresherState.Cancelling, '');
      }
    },

    /**
     * A number representing how far down the user has pulled.
     * The number `0` represents the user hasn't pulled down at all. The
     * number `1`, and anything greater than `1`, represents that the user
     * has pulled far enough down that when they let go then the refresh will
     * happen. If they let go and the number is less than `1`, then the
     * refresh will not happen, and the content will return to it's original
     * position.
     */
    getProgress() {
      return Promise.resolve(this.progress);
    },

    canStart(): boolean {
      if (!this.scrollEl) {
        return false;
      }
      if (this.state !== RefresherState.Inactive) {
        return false;
      }
      // if the scrollTop is greater than zero then it's
      // not possible to pull the content down yet
      if (this.scrollEl.scrollTop > 0) {
        return false;
      }
      return true;
    },

    onStart() {
      this.progress = 0;
      this.state = RefresherState.Inactive;
    },

    onMove(detail: GestureDetail) {
      if (!this.scrollEl) {
        return;
      }
      // this method can get called like a bazillion times per second,
      // so it's built to be as efficient as possible, and does its
      // best to do any DOM read/writes only when absolutely necessary
      // if multi-touch then get out immediately
      const ev = detail.event as TouchEvent;
      if (ev.touches && ev.touches.length > 1) {
        return;
      }

      // do nothing if it's actively refreshing
      // or it's in the way of closing
      // or this was never a startY
      if ((this.state & RefresherState._BUSY_) !== 0) {
        return;
      }

      const pullFactor = (Number.isNaN(this.pullFactor) || this.pullFactor < 0) ? 1 : this.pullFactor;
      const deltaY = detail.deltaY * pullFactor;
      // don't bother if they're scrolling up
      // and have not already started dragging
      if (deltaY <= 0) {
        // the current Y is higher than the starting Y
        // so they scrolled up enough to be ignored
        this.progress = 0;
        this.state = RefresherState.Inactive;

        if (this.appliedStyles) {
          // reset the styles only if they were applied
          this.setCss(0, '', false, '');
          return;
        }

        return;
      }

      if (this.state === RefresherState.Inactive) {
        // this refresh is not already actively pulling down
        // get the content's scrollTop
        const scrollHostScrollTop = this.scrollEl.scrollTop;

        // if the scrollTop is greater than zero then it's
        // not possible to pull the content down yet
        if (scrollHostScrollTop > 0) {
          this.progress = 0;
          return;
        }

        // content scrolled all the way to the top, and dragging down
        this.state = RefresherState.Pulling;
      }

      // prevent native scroll events
      if (ev.cancelable) {
        ev.preventDefault();
      }

      // the refresher is actively pulling at this point
      // move the scroll element within the content element
      this.setCss(deltaY, '0ms', true, '');

      if (deltaY === 0) {
        // don't continue if there's no delta yet
        this.progress = 0;
        return;
      }

      const { pullMin } = this;
      // set pull progress
      this.progress = deltaY / pullMin;

      // emit "start" if it hasn't started yet
      if (!this.didStart) {
        this.didStart = true;
        this.$emit('start');
      }

      // emit "pulling" on every move
      this.$emit('pull');

      // do nothing if the delta is less than the pull threshold
      if (deltaY < pullMin) {
        // ensure it stays in the pulling state, cuz its not ready yet
        this.state = RefresherState.Pulling;
        return;
      }

      if (deltaY > this.pullMax) {
        // they pulled farther than the max, so kick off the refresh
        this.beginRefresh();
        return;
      }

      // pulled farther than the pull min!!
      // it is now in the `ready` state!!
      // if they let go then it'll refresh, kerpow!!
      this.state = RefresherState.Ready;
    },

    onEnd() {
      // only run in a zone when absolutely necessary
      if (this.state === RefresherState.Ready) {
        // they pulled down far enough, so it's ready to refresh
        this.beginRefresh();
      } else if (this.state === RefresherState.Pulling) {
        // they were pulling down, but didn't pull down far enough
        // set the content back to it's original location
        // and close the refresher
        // set that the refresh is actively cancelling
        this.cancel();
      }
    },

    beginRefresh() {
      // assumes we're already back in a zone
      // they pulled down far enough, so it's ready to refresh
      this.state = RefresherState.Refreshing;

      // place the content in a hangout position while it thinks
      this.setCss(this.pullMin, this.snapbackDuration, true, '');

      // emit "refresh" because it was pulled down far enough
      // and they let go to begin refreshing
      this.$emit('refresh', { complete: this.complete.bind(this) });
    },

    close(state: RefresherState, delay: string) {
      // create fallback timer incase something goes wrong with transitionEnd event
      setTimeout(() => {
        this.state = RefresherState.Inactive;
        this.progress = 0;
        this.didStart = false;
        this.setCss(0, '0ms', false, '');
      }, 600);

      // reset set the styles on the scroll element
      // set that the refresh is actively cancelling/completing
      this.state = state;
      this.setCss(0, this.closeDuration, true, delay);

      // TODO: stop gesture
    },


    setCss(y: number, duration: string, overflowVisible: boolean, delay: string) {
      if (this.nativeRefresher) { return; }

      this.appliedStyles = (y > 0);
      this.$nextTick(() => {
        if (this.scrollEl && this.backgroundContentEl) {
          const scrollStyle = this.scrollEl.style;
          const backgroundStyle = this.backgroundContentEl.style;
          scrollStyle.transform = backgroundStyle.transform = ((y > 0) ? `translateY(${ y }px) translateZ(0px)` : '');
          scrollStyle.transitionDuration = backgroundStyle.transitionDuration = duration;
          scrollStyle.transitionDelay = backgroundStyle.transitionDelay = delay;
          scrollStyle.overflow = (overflowVisible ? 'hidden' : '');
        }
      });
    },

    disabledChanged() {
      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    },
  },

  watch : {
    disabled() {
      this.disabledChanged();
    },
  },

  async mounted() {
    this.checkNativeRefresher();

    // if (this.$el.getAttribute('slot') !== 'fixed') {
    //   console.error('Make sure you use: <line-refresher slot="fixed">');
    //   return;
    // }

    const contentEl = this.$parent.$options.name === 'line-content' ? this.$parent.$el : null;

    if (!contentEl) {
      console.error('<line-refresher> must be used inside an <line-content>');
      return;
    }

    this.scrollEl = await this.$parent.getScrollElement();
    this.backgroundContentEl = this.$parent.$refs.backgroundContentEl as HTMLElement;
    const { mode } = this;
    if (shouldUseNativeRefresher(this.$el as HTMLElement, mode)) {
      this.setupNativeRefresher(contentEl as HTMLElement);
    } else {
      this.gesture = createGesture({
        el              : contentEl,
        gestureName     : 'refresher',
        gesturePriority : 10,
        direction       : 'y',
        threshold       : 20,
        passive         : false,
        canStart        : () => this.canStart(),
        onStart         : () => this.onStart(),
        onMove          : ev => this.onMove(ev),
        onEnd           : () => this.onEnd(),
      });

      this.disabledChanged();
    }
  },

  render() {
    const { mode } = this;

    return (
      <div
        class={[
          bem(),
          {
            // Used internally for styling
            [`refresher-${ mode }`] : true,
            'refresher-native'      : this.nativeRefresher,
            'refresher-active'      : this.state !== RefresherState.Inactive,
            'refresher-pulling'     : this.state === RefresherState.Pulling,
            'refresher-ready'       : this.state === RefresherState.Ready,
            'refresher-refreshing'  : this.state === RefresherState.Refreshing,
            'refresher-cancelling'  : this.state === RefresherState.Cancelling,
            'refresher-completing'  : this.state === RefresherState.Completing,
          },
        ]}
      >
        {this.slots()}
      </div>
    );
  },
});
