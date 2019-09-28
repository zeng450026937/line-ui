<template>
  <div class="list-view" v-on:scroll="onScroll" ref="viewport">
    <div class="list-spacer" :style="{ 
      width: `${layout.geometry.width}px`,
      height: `${layout.geometry.height}px`
    }">
    </div>
    
    <template v-for="index in (to - from + 1)">
      <list-item
        :key="mapToItemIndex(index - 1)"
        :index="mapToItemIndex(index - 1)"
        :style="itemStyleAtIndex(mapToItemIndex(index - 1))"
      >
        <slot name="delegate" v-bind="itemAtIndex(mapToItemIndex(index - 1))"></slot>
      </list-item>
    </template>
  </div>
</template>

<script>
import ListItem from './ListItem.vue';
import { Orientation, BoxLayout, LayoutItem } from '@/utils/layout';
import { binarySearch } from '@/utils/algorithm/binary-search';

export const FooterPositioning = {
  InlineFooter: 0,
  OverlayFooter: 1,
  PullBackFooter: 2,
};

export const HeaderPositioning = {
  InlineFooter: 0,
  OverlayFooter: 1,
  PullBackFooter: 2,
};

export const LayoutDirection = {
  LeftToRight: 0,
  RightToLeft: 1,
};

export const HighlightRangeMode = {
  ApplyRange: 0,
  StrictlyEnforceRange: 1,
  NoHighlightRange: 2,
};

export { Orientation };

export const ViewSection = {
  InlineLabels: 0,
  CurrentLabelAtStart: 1,
  NextLabelAtEnd: 2,
};

export const SnapMode = {
  NoSnap: 0,
  SnapToItem: 1,
  SnapOneItem: 2,
};

export const VerticalLayoutDirection = {
  TopToBottom: 0,
  BottomToTop: 1,
};

export default {
  name: 'ListView',

  components: {
    ListItem,
  },

  props: {
    add: {
      type: String,
      default: '',
    },
    addDisplaced: {
      type: String,
      default: '',
    },
    cacheBuffer: {
      type: Number,
      default: 3,
    },
    count: {
      type: Number,
      default: 0,
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    displaced: {
      type: String,
      default: '',
    },
    displayMarginBeginning: {
      type: Number,
      default: 0,
    },
    displayMarginEnd: {
      type: Number,
      default: 0,
    },
    footer: {
      type: Object,
      default: () => ({}),
    },
    footerPositioning: {
      type: Number,
      default: 0,
    },
    header: {
      type: Object,
      default: () => ({}),
    },
    headerPositioning: {
      type: Number,
      default: 0,
    },
    highlight: {
      type: Object,
      default: () => ({}),
    },
    highlightFollowsCurrentItem: {
      type: Boolean,
      default: true,
    },
    highlightMoveDuration: {
      type: Number,
      default: 1000,
    },
    highlightMoveVelocity: {
      type: Number,
      default: -1,
    },
    highlightRangeMode: {
      type: Number,
      default: 0,
    },
    highlightResizeDuration: {
      type: Number,
      default: 0,
    },
    highlightResizeVelocity: {
      type: Number,
      default: 0,
    },
    keyNavigationEnabled: {
      type: Boolean,
      default: true,
    },
    keyNavigationWraps: {
      type: Boolean,
      default: false,
    },
    layoutDirection: {
      type: Number,
      default: 0,
    },
    model: {
      type: [Object, Number, Array],
      default: () => ([]),
    },
    move: {
      type: String,
      default: '',
    },
    moveDisplaced: {
      type: String,
      default: '',
    },
    orientation: {
      type: Number,
      default: Orientation.Vertical,
      validator(val) {
        return val === Orientation.Vertical || val === Orientation.Horizontal;
      },
    },
    populate: {
      type: String,
      default: '',
    },
    preferredHighlightBegin: {
      type: Number,
      default: 0,
    },
    preferredHighlightEnd: {
      type: Number,
      default: 0,
    },
    remove: {
      type: String,
      default: '',
    },
    removeDisplaced: {
      type: String,
      default: '',
    },
    section: {
      type: Object,
      default: () => ({
        property: '',
        criteria: 0,
        delegate: null,
        labelPositioning: 0,
      }),
    },
    snapMode: {
      type: Number,
      default: 0,
    },
    spacing: {
      type: Number,
      default: 0,
    },
    verticalLayoutDirection: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
    };
  },

  computed: {
    currentItem() {
      return null;
    },
    currentSection() {
      return '';
    },
    footerItem() {
      return null;
    },
    headerItem() {
      return null;
    },
    highlightItem() {
      return null;
    },

    horizontal() {
      return this.orientation === Orientation.Horizontal;
    },
    vertical() {
      return this.orientation === Orientation.Vertical;
    },

    visibleItemCount() {
      return this.visibleEndIndex - this.visibleStartIndex + 1;
    },
    itemCount() {
      if (Array.isArray(this.model)) {
        return this.model.length;
      }
      return this.model;
    },
  },

  provide() {
    return {
      ListView: this,
    };
  },

  watch: {
  },

  methods: {
    decrementCurrentIndex() {},
    forceLayout() {},
    incrementCurrentIndex() {},
    indexAt(x, y) {
      const index = binarySearch(
        this.layout.items,
        this.horizontal ? x : y,
        (item, wanted) => {
          const {
            left, right, top, bottom, 
          } = item.geometry;
          const leftBoundary = this.horizontal ? left : top;
          const rightBoundary = this.horizontal ? right : bottom;
          if (rightBoundary < wanted) { return -1; }
          if (leftBoundary > wanted) { return 1; }
          return 0;
        },
      );

      return index;
    },
    itemAt(x, y) {
      const index = this.indexAt(x, y);
      return this.itemAtIndex(index);
    },
    itemAtIndex(index) {
      if (Array.isArray(this.model)) {
        return this.model[index];
      }
      return index;
    },
    positionViewAtBeginning() {},
    positionViewAtEnd() {},
    positionViewAtIndex(index, mode) {},

    itemLayoutAt(x, y) {
      const index = this.indexAt(x, y);
      return this.layout.itemAt(index);
    },
    itemLayoutAtIndex(index) {
      return this.layout.itemAt(index);
    },
    itemStyleAtIndex(index) {
      const { geometry } = this.layout.itemAt(index);
      return Object.freeze({
        left: `${geometry.left}px`,
        top: `${geometry.top}px`,
        width: this.horizontal ? 'auto' : '100%',
        height: this.horizontal ? '100%' : 'auto',
      });
    },
    mapToItemIndex(visibleIndex) {
      return this.from + visibleIndex;
    },
    onScroll(event) {
      const { scrollLeft, scrollTop } = event.target;

      const threshold = this.minimumSize;
      if (Math.abs(this.scrollLeft - scrollLeft) >= threshold
      || Math.abs(this.scrollTop - scrollTop) >= threshold
      ) {
        this.incremental = this.horizontal 
          ? scrollLeft > this.scrollLeft
          : scrollTop > this.scrollTop;
        this.decremental = !this.incremental;

        this.scrollLeft = scrollLeft;
        this.scrollTop = scrollTop;

        console.log('onScroll', this.scrollLeft, this.scrollTop, this.incremental, this.decremental);
        if (!this.pending) {
          this.onUpdate();
        } else { console.warn('pending'); }
      }
    },
    async onLayout(index, offsetWidth, offsetHeight) {
      console.log('onLayout', index, offsetWidth, offsetHeight);

      const item = this.layout.itemAt(index);
      item.setSize(offsetWidth, offsetHeight);

      this.minimumSize = Math.min(
        16, this.minimumSize, this.horizontal ? offsetWidth : offsetHeight,
      );
      this.maximumSize = Math.min(
        16, this.maximumSize, this.horizontal ? offsetWidth : offsetHeight,
      );

      if (!this.pending) {
        this.pending = true;
        await this.$nextTick();
        this.layout.update(item);
        this.onUpdate();
        // this.$forceUpdate();
        this.pending = null;
      }
    },
    async onUpdate() {
      const { count } = this.layout;
      const clientSize = this.horizontal ? this.clientWidth : this.clientHeight;
      const leftBoundary = this.horizontal ? this.scrollLeft : this.scrollTop;
      const rightBoundary = leftBoundary + clientSize;
      const lastFrom = this.from;
      const lastTo = this.to;
      const last = this.layout.itemAt(count - 1);
      const total = this.horizontal 
        ? last.geometry.right 
        : last.geometry.bottom;

      let newTo;
      const newFrom = binarySearch(
        this.layout.items,
        leftBoundary,
        (item, wanted) => {
          const {
            left, right, top, bottom, 
          } = item.geometry;
          const leftBound = this.horizontal ? left : top;
          const rightBound = this.horizontal ? right : bottom;
          if (rightBound < wanted) { return -1; }
          if (leftBound > wanted) { return 1; }
          return 0;
        },
        this.incremental ? lastFrom : 0,
        this.incremental ? count - 1 : Math.min(count - 1, lastFrom * 2),
      );

      if (total > rightBoundary) {
        newTo = binarySearch(
          this.layout.items,
          rightBoundary,
          (item, wanted) => {
            const {
              left, right, top, bottom, 
            } = item.geometry;
            const leftBound = this.horizontal ? left : top;
            const rightBound = this.horizontal ? right : bottom;
            if (rightBound < wanted) { return -1; }
            if (leftBound > wanted) { return 1; }
            return 0;
          },
          this.incremental ? lastTo : 0,
          this.incremental ? count - 1 : Math.min(count - 1, lastTo * 2),
        );
        const visiable = this.layout.itemAt(newTo);
        const visiableBoundary = this.horizontal 
          ? visiable.geometry.right 
          : visiable.geometry.bottom;
        
        const left = Math.floor(rightBoundary - visiableBoundary);

        if (left > 0) {
          const needed = Math.ceil(left / visiableBoundary * newTo); 
          newTo += needed;
          newTo = Math.min(count - 1, newTo);
        }
      } else {
        newTo = count - 1;
      }

      console.log(
        'onUpdate \n\n',
        `total: ${total}, estimated: ${rightBoundary} \n`,
        `from: ${lastFrom} -> ${newFrom} \n`,
        `to: ${lastTo} -> ${newTo}`,
      );

      // if (this.incremental && newTo !== lastTo) {
      //   console.log('incremental phase 1. diff:', newTo - lastTo);
      //   if (newFrom > lastTo) {
      //     this.from = newFrom;
      //   }
      //   this.to = newTo;
      //   this.$forceUpdate();
      //   if (this.from !== newFrom) {
      //     await this.$nextTick();
      //     console.log('incremental phase 2');
      //     this.from = newFrom;
      //     this.$forceUpdate();
      //   }
      // }
      // if (this.decremental && newFrom !== lastFrom) {
      //   console.log('decremental phase 1. diff:', lastFrom - newFrom);
      //   if (lastFrom < newFrom) debugger;
      //   this.from = newFrom;
      //   if (newTo < lastFrom) {
      //     this.to = newTo;
      //   }
      //   this.$forceUpdate();
      //   if (this.to !== newTo) {
      //     await this.$nextTick();
      //     console.log('decremental phase 2');
      //     this.to = newTo;
      //     this.$forceUpdate();
      //   }
      // }

      if (newFrom !== lastFrom || newTo !== lastTo) {
        this.from = newFrom;
        this.to = newTo;
        this.$forceUpdate();
      }
    },
  },

  created() {
    console.log('create start');
    const ITEM_INITIAL_SIZE = 50;
    const LIST_VIEW_INITIAL_SIZE = 400;
    const count = LIST_VIEW_INITIAL_SIZE / ITEM_INITIAL_SIZE;

    this.layout = new BoxLayout(this.orientation);
    this.layout.setCount(this.itemCount, () => new LayoutItem(50, 50));

    this.from = 0;
    this.to = count - 1;

    this.minimumSize = ITEM_INITIAL_SIZE;
    this.maximumSize = ITEM_INITIAL_SIZE;

    this.pending = null;

    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.incremental = true;
    this.decremental = false;
    console.log('create end', this.layout, this.layout.count);
  },

  async mounted() {
    this.$emit('add');
    this.$emit('remove');

    this.clientWidth = this.$refs.viewport.clientWidth;
    this.clientHeight = this.$refs.viewport.clientHeight;

    await this.$nextTick();
  },
};
</script>

<style lang="scss">
.list-view {
  position: relative;
  overflow: auto;
  width: 400px;
  height: 400px;
  border: dotted palevioletred;
}
</style>
