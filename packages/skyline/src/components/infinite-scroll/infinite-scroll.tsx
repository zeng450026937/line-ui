import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('infinite-scroll');

export default /*#__PURE__*/ createComponent({
  props : {
    threshold : {
      type    : String,
      default : '15%',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
    position : {
      type    : String,
      default : 'bottom',
    },
  },

  data() {
    return {
      isLoading : false,
    };
  },

  watch : {
    threshold() {
      this.thresholdChanged();
    },
  },

  async mounted() {
    const contentEl = this.$parent.$options.name === 'line-content' ? this.$parent.$el : null;

    if (!contentEl) {
      console.error('<line-infinite-scroll> must be used inside an <line-content>');
      return;
    }

    this.scrollEl = await (this.$parent as any).getScrollElement();
    this.thresholdChanged();
    this.disabledChanged();
    if (this.position === 'top') {
      this.$nextTick(() => {
        if (this.scrollEl) {
          this.scrollEl.scrollTop = this.scrollEl.scrollHeight - this.scrollEl.clientHeight;
        }
      });
    }
  },

  beforeDestroy() {
    this.enableScrollEvents(false);
    this.scrollEl = undefined;
  },

  methods : {
    onScroll() {
      const { scrollEl } = this;
      if (!scrollEl || !this.canStart()) {
        return 1;
      }

      const infiniteHeight = (this.$el as HTMLElement).offsetHeight;
      if (infiniteHeight === 0) {
        // if there is no height of this element then do nothing
        return 2;
      }
      const { scrollTop } = scrollEl;
      const { scrollHeight } = scrollEl;
      const height = scrollEl.offsetHeight;
      const threshold = this.thrPc !== 0 ? (height * this.thrPc) : this.thrPx;

      const distanceFromInfinite = (this.position === 'bottom')
        ? scrollHeight - infiniteHeight - scrollTop - threshold - height
        : scrollTop - infiniteHeight - threshold;

      if (distanceFromInfinite < 0) {
        if (!this.didFire) {
          this.isLoading = true;
          this.didFire = true;
          this.$emit('infinite', { complete: this.complete.bind(this) });
          return 3;
        }
      } else {
        this.didFire = false;
      }

      return 4;
    },

    /**
     * Call `complete()` within the `ionInfinite` output event handler when
     * your async operation has completed. For example, the `loading`
     * state is while the app is performing an asynchronous operation,
     * such as receiving more data from an AJAX request to add more items
     * to a data list. Once the data has been received and UI updated, you
     * then call this method to signify that the loading has completed.
     * This method will change the infinite scroll's state from `loading`
     * to `enabled`.
     */
    async complete() {
      const { scrollEl } = this;
      if (!this.isLoading || !scrollEl) {
        return;
      }
      this.isLoading = false;

      if (this.position === 'top') {
      /**
       * New content is being added at the top, but the scrollTop position stays the same,
       * which causes a scroll jump visually. This algorithm makes sure to prevent this.
       * (Frame 1)
       *    - complete() is called, but the UI hasn't had time to update yet.
       *    - Save the current content dimensions.
       *    - Wait for the next frame using _dom.read, so the UI will be updated.
       * (Frame 2)
       *    - Read the new content dimensions.
       *    - Calculate the height difference and the new scroll position.
       *    - Delay the scroll position change until other possible dom
       * reads are done using _dom.write to be performant.
       * (Still frame 2, if I'm correct)
       *    - Change the scroll position (= visually maintain the scroll position).
       *    - Change the state to re-enable the InfiniteScroll.
       *    - This should be after changing the scroll position, or it could
       *    cause the InfiniteScroll to be triggered again immediately.
       * (Frame 3)
       *    Done.
       */
        this.isBusy = true;
        // ******** DOM READ ****************
        // Save the current content dimensions before the UI updates
        const prev = scrollEl.scrollHeight - scrollEl.scrollTop;

        // ******** DOM READ ****************
        requestAnimationFrame(() => {
          this.$nextTick(() => {
            // UI has updated, save the new content dimensions
            const { scrollHeight } = scrollEl;
            // New content was added on top, so the scroll position
            // should be changed immediately to prevent it from jumping around
            const newScrollTop = scrollHeight - prev;

            // ******** DOM WRITE ****************
            requestAnimationFrame(() => {
              this.$nextTick(() => {
                scrollEl.scrollTop = newScrollTop;
                this.isBusy = false;
              });
            });
          });
        });
      }
    },

    canStart(): boolean {
      return (
        !this.disabled
      && !this.isBusy
      && !!this.scrollEl
      && !this.isLoading
      );
    },

    enableScrollEvents(shouldListen: boolean) {
      if (this.scrollEl) {
        if (shouldListen) {
          this.scrollEl.addEventListener('scroll', this.onScroll);
        } else {
          this.scrollEl.removeEventListener('scroll', this.onScroll);
        }
      }
    },

    thresholdChanged() {
      const val = this.threshold;
      if (val.lastIndexOf('%') > -1) {
        this.thrPx = 0;
        this.thrPc = (parseFloat(val) / 100);
      } else {
        this.thrPx = parseFloat(val);
        this.thrPc = 0;
      }
    },

    disabledChanged() {
      const { disabled } = this;
      if (disabled) {
        this.isLoading = false;
        this.isBusy = false;
      }
      this.enableScrollEvents(!disabled);
    },
  },

  render() {
    const { disabled, isLoading } = this;
    return (
      <div
        class={[
          bem(),
          {
            'infinite-scroll-loading' : isLoading,
            'infinite-scroll-enabled' : !disabled,
          },
        ]}
      >
        {this.slots()}
      </div>
    );
  },
});
