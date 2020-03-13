import { createNamespace } from 'skyline/utils/namespace';
import { useColor } from 'skyline/mixins/use-color';
import { isPlatform } from 'skyline/utils/platform';
import {
  scrollByPoint,
  scrollToBottom,
  scrollToElement,
  scrollToPoint,
  scrollToTop,
} from 'skyline/utils/scroll-to';
import { isString } from 'skyline/utils/helpers';
import { updateScrollDetail } from 'skyline/components/content/update-scroll-detail';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('content');

const getParentElement = (el: any) => {
  if (el.parentElement) {
    // normal element with a parent element
    return el.parentElement;
  }
  if (el.parentNode && el.parentNode.host) {
    // shadow dom's document fragment
    return el.parentNode.host;
  }
  return null;
};

const getPageElement = (el: HTMLElement) => {
  const tabs = el.closest('.line-tabs');
  if (tabs) {
    return tabs;
  }
  const page = el.closest('.line-app,.line-page,page-inner');
  if (page) {
    return page;
  }
  return getParentElement(el);
};

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  provide(): any {
    return {
      Content : this,
    };
  },

  props : {
    forceOverscroll : Boolean,
    fullscreen      : Boolean,
    scrollX         : {
      type    : Boolean,
      default : false,
    },
    scrollY : {
      type    : Boolean,
      default : true,
    },
    scrollEvents : Boolean,
    value        : Boolean,
  },

  data() {
    return {
      cTop    : 0,
      cBottom : 0,
    };
  },

  computed : {
    shouldForceOverscroll(): boolean {
      const { forceOverscroll, mode } = this;
      return forceOverscroll === undefined
        ? mode === 'ios' && isPlatform('ios')
        : forceOverscroll;
    },
  },

  watch : {
    fullscreen(val) {
      if (val) {
        this.readDimensions();
      } else {
        this.cTop = this.cBottom = 0;
      }
    },
  },

  async mounted() {
    if (this.fullscreen) {
      await this.$nextTick();
      this.readDimensions();
    }
  },

  methods : {
    readDimensions() {
      const el = this.$el as HTMLElement;
      const page = getPageElement(el);
      const top = Math.max(el.offsetTop, 0);
      const bottom = Math.max(page.offsetHeight - top - el.offsetHeight, 0);
      const dirty = top !== this.cTop || bottom !== this.cBottom;
      if (dirty) {
        this.cTop = top;
        this.cBottom = bottom;
      }
    },

    getScrollElement() {
      return this.$refs.scrollEl as HTMLElement;
    },

    getBackgroundContent() {
      return this.$refs.backgroundContentEl as HTMLElement;
    },

    async scrollByPoint(x: number, y: number, duration?: number) {
      const { scrollEl } = this.$refs;
      if (!scrollEl) return;
      await scrollByPoint(scrollEl as HTMLElement, x, y, duration);
    },

    async scrollToElement(el: HTMLElement | string) {
      const { scrollEl } = this.$refs as { scrollEl: HTMLElement };
      if (!scrollEl) return;
      const target = isString(el)
        ? scrollEl.querySelector(el) as HTMLElement | null
        : el;
      await scrollToElement(scrollEl, target);
    },

    async scrollToBottom(duration?: number) {
      const { scrollEl } = this.$refs;
      if (!scrollEl) return;
      await scrollToBottom(scrollEl as HTMLElement, duration);
    },

    async scrollToPoint(x: number, y: number, duration?: number) {
      const { scrollEl } = this.$refs;
      if (!scrollEl) return;
      await scrollToPoint(scrollEl as HTMLElement, x, y, duration);
    },

    async scrollToTop(duration?: number) {
      const { scrollEl } = this.$refs;
      if (!scrollEl) return;
      await scrollToTop(scrollEl as HTMLElement, duration);
    },

    onClick(ev: Event) {
      if (this.isScrolling) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },

    async onScroll(ev: UIEvent) {
      const timeStamp = Date.now();
      const shouldStart = !this.isScrolling;
      this.lastScroll = timeStamp;
      if (shouldStart) {
        this.onScrollStart();
      }
      if (!this.queued && this.scrollEvents) {
        this.queued = true;
        await this.$nextTick();
        this.queued = false;
        this.detail.event = ev;
        updateScrollDetail(this.detail, this.scrollEl, Date.now(), shouldStart);
        this.ionScroll.emit(this.detail);
        this.$emit('scroll', this.detail);
      }
    },

    onScrollStart() {
      this.isScrolling = true;
      this.$emit('scrollstart', {
        isScrolling : true,
      });

      if (this.watchDog) {
        clearInterval(this.watchDog);
      }
      // watchdog
      this.watchDog = setInterval(() => {
        if (this.lastScroll < Date.now() - 120) {
          this.onScrollEnd();
        }
      }, 100);
    },

    onScrollEnd() {
      clearInterval(this.watchDog);
      this.watchDog = null;
      if (this.isScrolling) {
        this.isScrolling = false;
        this.$emit('scrollend', {
          isScrolling : false,
        });
      }
    },
  },

  render() {
    const { scrollX, scrollY, shouldForceOverscroll } = this;
    return (
      <div
        class={[
          bem(),
          false && 'content-sizing',
          shouldForceOverscroll && 'overscroll',
        ]}
        style={{
          '--offset-top'    : `${ this.cTop || 0 }px`,
          '--offset-bottom' : `${ this.cBottom || 0 }px`,
        }}
        on={{
          '!click' : this.onClick,
        }}
      >
        <div
          ref="backgroundContentEl"
          id="background-content"
        ></div>
        <main
          class={{
            'inner-scroll' : true,
            'scroll-x'     : scrollX,
            'scroll-y'     : scrollY,
            overscroll     : (scrollX || scrollY) && shouldForceOverscroll,
          }}
          ref={'scrollEl'}
          onScroll={this.onScroll}
        >
          {this.slots()}
        </main>
        {this.slots('fixed')}

      </div>
    );
  },
});
