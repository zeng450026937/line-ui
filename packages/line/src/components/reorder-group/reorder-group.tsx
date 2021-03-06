import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { createGesture, GestureDetail } from '@line-ui/line/src/utils/gesture';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('reorder-group');

const enum ReorderGroupState {
  Idle = 0,
  Active = 1,
  Complete = 2,
}

const indexForItem = (element: any): number => {
  return element.$lineIndex;
};

const findReorderItem = (
  node: HTMLElement | null,
  container: HTMLElement
): HTMLElement | undefined => {
  let parent: HTMLElement | null;
  while (node) {
    parent = node.parentElement;
    if (parent === container) {
      return node;
    }
    node = parent;
  }
  return undefined;
};

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;
const ITEM_REORDER_SELECTED = 'line-reorder--selected';

const reorderArray = (array: any[], from: number, to: number): any[] => {
  const element = array[from];
  array.splice(from, 1);
  array.splice(to, 0, element);
  return array.slice();
};

export default /*#__PURE__*/ createComponent({
  inject: {
    Content: { default: undefined },
  },

  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      state: ReorderGroupState.Idle,
    };
  },

  beforeMount() {
    this.lastToIndex = -1;
    this.cachedHeights = [];
    this.scrollElTop = 0;
    this.scrollElBottom = 0;
    this.scrollElInitial = 0;
    this.containerTop = 0;
    this.containerBottom = 0;
  },

  async mounted() {
    const contentEl = this.Content;
    if (contentEl) {
      this.scrollEl = await contentEl.getScrollElement();
    }

    this.gesture = createGesture({
      el: this.$el,
      gestureName: 'reorder',
      gesturePriority: 110,
      threshold: 0,
      direction: 'y',
      passive: false,
      canStart: (detail) => this.canStart(detail),
      onStart: (ev) => this.onStart(ev),
      onMove: (ev) => this.onMove(ev),
      onEnd: () => this.onEnd(),
    });

    this.disabledChanged();
  },

  beforeDestroy() {
    this.onEnd();
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  },

  methods: {
    disabledChanged() {
      if (this.gesture) {
        this.gesture.enable(!this.disabled);
      }
    },

    /**
     * Completes the reorder operation. Must be called by the `ionItemReorder` event.
     *
     * If a list of items is passed, the list will be reordered and returned in the
     * proper order.
     *
     * If no parameters are passed or if `true` is passed in, the reorder will complete
     * and the item will remain in the position it was dragged to. If `false` is passed,
     * the reorder will complete and the item will bounce back to its original position.
     *
     * @param listOrReorder A list of items to be sorted and returned in the new order or a
     * boolean of whether or not the reorder should reposition the item.
     */
    complete(listOrReorder?: boolean | any[]): Promise<any> {
      return Promise.resolve(this.completeSync(listOrReorder));
    },

    canStart(ev: GestureDetail): boolean {
      if (this.selectedItemEl || this.state !== ReorderGroupState.Idle) {
        return false;
      }
      const target = ev.event.target as HTMLElement;
      const reorderEl = target.closest('.line-reorder');
      if (!reorderEl) {
        return false;
      }
      const item = findReorderItem(
        reorderEl as HTMLElement,
        this.$el as HTMLElement
      );
      if (!item) {
        return false;
      }
      ev.data = item;
      return true;
    },

    onStart(ev: GestureDetail) {
      ev.event.preventDefault();

      const item = (this.selectedItemEl = ev.data);
      const heights = this.cachedHeights;
      heights.length = 0;
      const { $el } = this;
      const { children } = $el;
      if (!children || children.length === 0) {
        return;
      }

      let sum = 0;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        sum += (child as HTMLElement).offsetHeight;
        heights.push(sum);
        (child as any).$lineIndex = i;
      }

      const box = $el.getBoundingClientRect();
      this.containerTop = box.top;
      this.containerBottom = box.bottom;

      if (this.scrollEl) {
        const scrollBox = this.scrollEl.getBoundingClientRect();
        this.scrollElInitial = this.scrollEl.scrollTop;
        this.scrollElTop = scrollBox.top + AUTO_SCROLL_MARGIN;
        this.scrollElBottom = scrollBox.bottom - AUTO_SCROLL_MARGIN;
      } else {
        this.scrollElInitial = 0;
        this.scrollElTop = 0;
        this.scrollElBottom = 0;
      }

      this.lastToIndex = indexForItem(item);
      this.selectedItemHeight = item.offsetHeight;
      this.state = ReorderGroupState.Active;

      item.classList.add(ITEM_REORDER_SELECTED);

      // hapticSelectionStart();
    },

    onMove(ev: GestureDetail) {
      const selectedItem = this.selectedItemEl;
      if (!selectedItem) {
        return;
      }
      // Scroll if we reach the scroll margins
      const scroll = this.autoscroll(ev.currentY);

      // // Get coordinate
      const top = this.containerTop - scroll;
      const bottom = this.containerBottom - scroll;
      const currentY = Math.max(top, Math.min(ev.currentY, bottom));
      const deltaY = scroll + currentY - ev.startY;
      const normalizedY = currentY - top;
      const toIndex = this.itemIndexForTop(normalizedY);
      if (toIndex !== this.lastToIndex) {
        const fromIndex = indexForItem(selectedItem);
        this.lastToIndex = toIndex;

        // hapticSelectionChanged();
        this.reorderMove(fromIndex, toIndex);
      }

      // Update selected item position
      selectedItem.style.transform = `translateY(${deltaY}px)`;
    },

    onEnd() {
      const { selectedItemEl } = this;
      this.state = ReorderGroupState.Complete;
      if (!selectedItemEl) {
        this.state = ReorderGroupState.Idle;
        return;
      }

      const toIndex = this.lastToIndex;
      const fromIndex = indexForItem(selectedItemEl);

      if (toIndex === fromIndex) {
        this.completeSync();
      } else {
        this.$emit('itemReorder', {
          from: fromIndex,
          to: toIndex,
          complete: this.completeSync.bind(this),
        });
      }

      // hapticSelectionEnd();
    },

    completeSync(listOrReorder?: boolean | any[]): any {
      const { selectedItemEl } = this;
      if (selectedItemEl && this.state === ReorderGroupState.Complete) {
        const children = this.$el.children as any;
        const len = children.length;
        const toIndex = this.lastToIndex;
        const fromIndex = indexForItem(selectedItemEl);

        if (
          toIndex !== fromIndex &&
          (!listOrReorder || listOrReorder === true)
        ) {
          const ref =
            fromIndex < toIndex ? children[toIndex + 1] : children[toIndex];

          this.$el.insertBefore(selectedItemEl, ref);
        }

        if (Array.isArray(listOrReorder)) {
          listOrReorder = reorderArray(listOrReorder, fromIndex, toIndex);
        }

        for (let i = 0; i < len; i++) {
          children[i].style.transform = '';
        }

        selectedItemEl.style.transition = '';
        selectedItemEl.classList.remove(ITEM_REORDER_SELECTED);
        this.selectedItemEl = undefined;
        this.state = ReorderGroupState.Idle;
      }
      return listOrReorder;
    },

    itemIndexForTop(deltaY: number): number {
      const heights = this.cachedHeights;
      let i = 0;

      // TODO: since heights is a sorted array of integers, we can do
      // speed up the search using binary search. Remember that linear-search is still
      // faster than binary-search for small arrays (<64) due CPU branch misprediction.
      for (i = 0; i < heights.length; i++) {
        if (heights[i] > deltaY) {
          break;
        }
      }
      return i;
    },

    /** ******* DOM WRITE ********* */
    reorderMove(fromIndex: number, toIndex: number) {
      const itemHeight = this.selectedItemHeight;
      const { children } = this.$el;
      for (let i = 0; i < children.length; i++) {
        const { style } = children[i] as any;
        let value = '';
        if (i > fromIndex && i <= toIndex) {
          value = `translateY(${-itemHeight}px)`;
        } else if (i < fromIndex && i >= toIndex) {
          value = `translateY(${itemHeight}px)`;
        }
        style.transform = value;
      }
    },

    autoscroll(posY: number): number {
      if (!this.scrollEl) {
        return 0;
      }

      let amount = 0;
      if (posY < this.scrollElTop) {
        amount = -SCROLL_JUMP;
      } else if (posY > this.scrollElBottom) {
        amount = SCROLL_JUMP;
      }
      if (amount !== 0) {
        this.scrollEl.scrollBy(0, amount);
      }
      return this.scrollEl.scrollTop - this.scrollElInitial;
    },
  },

  watch: {
    disabled() {
      this.disabledChanged();
    },
  },

  render() {
    const { disabled, state } = this;

    return (
      <div
        class={bem({
          enabled: !disabled,
          'list-active': state !== ReorderGroupState.Idle,
        })}
      >
        {this.slots()}
      </div>
    );
  },
});
