import { createNamespace } from 'skyline/src/utils/namespace';
import {
  Swiper,
  SwiperOptions,
} from 'skyline/src/utils/swiper';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('slides');

export default /*#__PURE__*/ createComponent({
  props : {
    options   : Object,
    pager     : Boolean,
    scrollbar : Boolean,
  },

  data() {
    return {
      swiperReady : false,
    };
  },

  async mounted() {
    const mut = this.mutationO = new MutationObserver(() => {
      if (this.swiperReady) {
        this.update();
      }
    });
    mut.observe(this.$el, {
      childList : true,
      subtree   : true,
    });
    this.initSwiper();

    this.paginationEl = this.$refs && this.$refs.paginationEl;
    this.scrollbarEl = this.$refs && this.$refs.scrollbarEl;
  },

  async destroyed() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = undefined;
    }
    const swiper = await this.getSwiper();
    swiper && swiper.destroy(true, true);
    this.swiperReady = false;
  },

  methods : {
    async optionsChanged() {
      if (this.swiperReady) {
        const swiper = await this.getSwiper();
        Object.assign(swiper.params, this.options);
        await this.update();
      }
    },

    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     */
    async update() {
      const [swiper] = await Promise.all([
        this.getSwiper(),
      ]);
      if (swiper) {
        swiper.update();
      }
    },

    /**
     * Force swiper to update its height (when autoHeight is enabled) for the duration
     * equal to 'speed' parameter.
     *
     * @param speed The transition duration (in ms).
     */
    async updateAutoHeight(speed?: number) {
      const swiper = await this.getSwiper();
      swiper.updateAutoHeight(speed);
    },

    /**
     * Transition to the specified slide.
     *
     * @param index The index of the slide to transition to.
     * @param speed The transition duration (in ms).
     * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End]
     * transition events.
     */
    async slideTo(index: number, speed?: number, runCallbacks?: boolean) {
      const swiper = await this.getSwiper();
      swiper.slideTo(index, speed, runCallbacks);
    },

    /**
     * Transition to the next slide.
     *
     * @param speed The transition duration (in ms).
     * @param runCallbacks If true, the transition will produce [Transition/SlideChange][Start/End]
     * transition events.
     */
    async slideNext(speed?: number, runCallbacks?: boolean) {
      const swiper = await this.getSwiper();
      swiper.slideNext(speed, runCallbacks);
    },

    /**
     * Transition to the previous slide.
     *
     * @param speed The transition duration (in ms).
     * @param runCallbacks If true, the transition will produce the [Transition/SlideChange][Start/End]
     * transition events.
     */
    async slidePrev(speed?: number, runCallbacks?: boolean) {
      const swiper = await this.getSwiper();
      swiper.slidePrev(speed, runCallbacks);
    },

    /**
     * Get the index of the active slide.
     */
    async getActiveIndex(): Promise<number> {
      const swiper = await this.getSwiper();
      return swiper.activeIndex;
    },

    /**
     * Get the index of the previous slide.
     */
    async getPreviousIndex(): Promise<number> {
      const swiper = await this.getSwiper();
      return swiper.previousIndex;
    },

    /**
     * Get the total number of slides.
     */
    async length(): Promise<number> {
      const swiper = await this.getSwiper();
      return swiper.slides.length;
    },

    /**
     * Get whether or not the current slide is the last slide.
     */
    async isEnd(): Promise<boolean> {
      const swiper = await this.getSwiper();
      return swiper.isEnd;
    },

    /**
     * Get whether or not the current slide is the first slide.
     */
    async isBeginning(): Promise<boolean> {
      const swiper = await this.getSwiper();
      return swiper.isBeginning;
    },

    /**
     * Start auto play.
     */
    async startAutoplay() {
      const swiper = await this.getSwiper();
      if (swiper.autoplay) {
        swiper.autoplay.start();
      }
    },

    /**
     * Stop auto play.
     */
    async stopAutoplay() {
      const swiper = await this.getSwiper();
      if (swiper.autoplay) {
        swiper.autoplay.stop();
      }
    },

    /**
     * Lock or unlock the ability to slide to the next slide.
     *
     * @param lock If `true`, disable swiping to the next slide.
     */
    async lockSwipeToNext(lock: boolean) {
      const swiper = await this.getSwiper();
      swiper.allowSlideNext = !lock;
    },

    /**
     * Lock or unlock the ability to slide to the previous slide.
     *
     * @param lock If `true`, disable swiping to the previous slide.
     */
    async lockSwipeToPrev(lock: boolean) {
      const swiper = await this.getSwiper();
      swiper.allowSlidePrev = !lock;
    },

    /**
     * Lock or unlock the ability to slide to the next or previous slide.
     *
     * @param lock If `true`, disable swiping to the next and previous slide.
     */
    async lockSwipes(lock: boolean) {
      const swiper = await this.getSwiper();
      swiper.allowSlideNext = !lock;
      swiper.allowSlidePrev = !lock;
      swiper.allowTouchMove = !lock;
    },

    /**
     * Get the Swiper instance.
     * Use this to access the full Swiper API.
     * See https://idangero.us/swiper/api/ for all API options.
     */
    async getSwiper(): Promise<any> {
      return this.swiper;
    },

    async initSwiper() {
      const finalOptions = this.normalizeOptions();

      // init swiper core
      const swiper = new Swiper(this.$el as HTMLElement, finalOptions);
      this.swiperReady = true;
      this.swiper = swiper;
    },

    normalizeOptions(): SwiperOptions {
      // Base options, can be changed
      // TODO Add interface SwiperOptions
      const swiperOptions: SwiperOptions = {
        effect                        : undefined,
        direction                     : 'horizontal',
        initialSlide                  : 0,
        loop                          : false,
        parallax                      : false,
        slidesPerView                 : 1,
        spaceBetween                  : 0,
        speed                         : 300,
        slidesPerColumn               : 1,
        slidesPerColumnFill           : 'column',
        slidesPerGroup                : 1,
        centeredSlides                : false,
        slidesOffsetBefore            : 0,
        slidesOffsetAfter             : 0,
        touchEventsTarget             : 'container',
        autoplay                      : false,
        freeMode                      : false,
        freeModeMomentum              : true,
        freeModeMomentumRatio         : 1,
        freeModeMomentumBounce        : true,
        freeModeMomentumBounceRatio   : 1,
        freeModeMomentumVelocityRatio : 1,
        freeModeSticky                : false,
        freeModeMinimumVelocity       : 0.02,
        autoHeight                    : false,
        setWrapperSize                : false,
        zoom                          : {
          maxRatio : 3,
          minRatio : 1,
          toggle   : false,
        },
        touchRatio               : 1,
        touchAngle               : 45,
        simulateTouch            : true,
        touchStartPreventDefault : false,
        shortSwipes              : true,
        longSwipes               : true,
        longSwipesRatio          : 0.5,
        longSwipesMs             : 300,
        followFinger             : true,
        threshold                : 0,
        touchMoveStopPropagation : true,
        touchReleaseOnEdges      : false,
        iOSEdgeSwipeDetection    : false,
        iOSEdgeSwipeThreshold    : 20,
        resistance               : true,
        resistanceRatio          : 0.85,
        watchSlidesProgress      : false,
        watchSlidesVisibility    : false,
        preventClicks            : true,
        preventClicksPropagation : true,
        slideToClickedSlide      : false,
        loopAdditionalSlides     : 0,
        noSwiping                : true,
        runCallbacksOnInit       : true,
        coverflowEffect          : {
          rotate       : 50,
          stretch      : 0,
          depth        : 100,
          modifier     : 1,
          slideShadows : true,
        },
        flipEffect : {
          slideShadows  : true,
          limitRotation : true,
        },
        cubeEffect : {
          slideShadows : true,
          shadow       : true,
          shadowOffset : 20,
          shadowScale  : 0.94,
        },
        fadeEffect : {
          crossFade : false,
        },
        a11y : {
          prevSlideMessage  : 'Previous slide',
          nextSlideMessage  : 'Next slide',
          firstSlideMessage : 'This is the first slide',
          lastSlideMessage  : 'This is the last slide',
        },
      };

      if (this.pager) {
        swiperOptions.pagination = {
          el          : this.paginationEl,
          type        : 'bullets',
          clickable   : false,
          hideOnClick : false,
        };
      }

      if (this.scrollbar) {
        swiperOptions.scrollbar = {
          el   : this.scrollbarEl,
          hide : true,
        };
      }
      const emit = (eventName: string, data: any) => {
        this.$emit(eventName, data);
      };
      // Keep the event options separate, we dont want users
      // overwriting these
      const eventOptions: SwiperOptions = {
        on : {
          init : () => {
            setTimeout(() => {
              this.$emit('slidesDidLoad');
            }, 20);
          },
          slideChangeTransitionStart() {
            const { activeIndex } = this as any;
            emit('slideChangeTransitionStart', activeIndex);
          },
          slideChangeTransitionEnd() {
            const { activeIndex } = this as any;
            emit('slideChangeTransitionEnd', activeIndex);
          },
          slideNextTransitionStart : this.$emit('slideNextTransitionStart'),
          slidePrevTransitionStart : this.$emit('slidePrevTransitionStart'),
          slideNextTransitionEnd   : this.$emit('slideNextTransitionEnd'),
          slidePrevTransitionEnd   : this.$emit('slidePrevTransitionEnd'),
          transitionStart          : this.$emit('transitionStart'),
          transitionEnd            : this.$emit('transitionEnd'),
          sliderMove               : this.$emit('slideDrag'),
          reachBeginning           : this.$emit('slideReachStart'),
          reachEnd                 : this.$emit('slideReachEnd'),
          touchStart               : this.$emit('slideTouchStart'),
          touchEnd                 : this.$emit('slideTouchEnd'),
          tap                      : this.$emit('slideTap'),
          doubleTap                : this.$emit('slideDoubleTap'),
        },
      };

      const customEvents = (!!this.options && !!this.options.on) ? this.options.on : {};

      // merge "on" event listeners, while giving our event listeners priority
      const mergedEventOptions = { on: { ...customEvents, ...eventOptions.on } };

      // Merge the base, user options, and events together then pas to swiper
      return { ...swiperOptions, ...this.options, ...mergedEventOptions };
    },

  },

  watch : {
    options() {
      this.optionsChanged();
    },
  },

  render() {
    const { mode } = this;

    return (
      <div
        class={[
          bem(),
          {
            // Used internally for styling
            [`slides-${ mode }`] : true,
            'swiper-container'   : true,
          },
        ]}
      >
      <div class="swiper-wrapper">
        {this.slots()}
      </div>
      {this.pager && <div class="swiper-pagination" ref="paginationEl"></div>}
      {this.scrollbar && <div class="swiper-scrollbar" ref="scrollbarEl"></div>}
      </div>
    );
  },

});
