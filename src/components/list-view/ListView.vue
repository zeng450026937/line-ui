<template>
  <div class="list-view" v-on:scroll="onScroll" ref="viewport">
    <div class="list-spacer" :style="{ 
      width: `${estimatedWidth}px`,
      height: `${estimatedHeight}px`
    }">
    </div>
    
    <template v-for="index in visibleItemCount">
      <list-item
        v-bind:key="mapToItemIndex(index - 1)"
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
      visibleStartIndex: 0,
      visibleEndIndex: 0,
      scrollLeft: 0,
      scrollTop: 0,
      clientWidth: 400,
      clientHeight: 400,
      estimatedWidth: 400,
      estimatedHeight: 400,
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

  methods: {
    decrementCurrentIndex() {},
    forceLayout() {},
    incrementCurrentIndex() {},
    indexAt(x, y) {},
    itemAt(x, y) {},
    itemAtIndex(index) {
      if (Array.isArray(this.model)) {
        return this.model[index];
      }
      return index;
    },
    positionViewAtBeginning() {},
    positionViewAtEnd() {},
    positionViewAtIndex(index, mode) {},

    itemLayoutAtIndex(index) {
      return this.layout.itemAt(index);
    },
    itemStyleAtIndex(index) {
      const item = this.layout.itemAt(index);
      const style = item.toStyle();
      delete style.height;
      style.left = '0px';
      style.width = '100%';
      return Object.freeze(style);
    },
    mapToItemIndex(visibleIndex) {
      return this.visibleStartIndex + visibleIndex;
    },
    onScroll(event) {
      const { scrollLeft, scrollTop } = event.target;

      const threshold = 18;
      if (Math.abs(this.scrollLeft - scrollLeft) >= threshold
      || Math.abs(this.scrollTop - scrollTop) >= threshold
      ) {
        this.scrollLeft = scrollLeft;
        this.scrollTop = scrollTop;

        console.log('onScroll', scrollLeft, scrollTop);
        this.onUpdate();
      }
    },
    onLayout(index, offsetWidth, offsetHeight) {
      console.log('onLayout', index, offsetWidth, offsetHeight);
      this.layout.itemAt(index).setSize(offsetWidth, offsetHeight);

      if (!this.pending) {
        this.pending = setTimeout(() => {
          this.layout.update();
          this.onUpdate();
          // this.$forceUpdate();
          this.pending = null;
        });
      }
    },
    onUpdate() {
      const { count } = this.layout;

      let last;
      let from = 0;
      let to = count - 1;
      /* eslint-disable no-bitwise */
      let i = ~~(count / 2);
      /* eslint-enable no-bitwise */
      let offset = 0;

      // binary search for start index
      do {
        last = i;
        offset = this.layout.itemAt(i).geometry.bottom;
        if (offset < this.scrollTop) {
          from = i;
        } else if (i < count - 1
             && this.layout.itemAt(i + 1).geometry.bottom > this.scrollTop) {
          to = i;
        }
        /* eslint-disable no-bitwise */
        i = ~~((from + to) / 2);
        /* eslint-enable no-bitwise */
      } while (i !== last);

      this.visibleStartIndex = Math.min(i, count - 1);

      let left = this.scrollTop + this.clientHeight - offset;

      while (i < count - 1 && left > 0) {
        offset = this.layout.itemAt(++i).geometry.bottom;
        left = this.scrollTop + this.clientHeight - offset;
      }

      console.log('scrollTop', this.scrollTop, this.clientHeight);

      this.visibleEndIndex = i;
      
      const ITEM_INITIAL_SIZE = 50;
      const LIST_VIEW_INITIAL_SIZE = 400;

      if (left > 0) {
        const missed = left / count;
        const needed = Math.ceil(left / (ITEM_INITIAL_SIZE - missed));
        console.log('need more~', left, needed);
        
        for (let index = 0; index < needed; index++) {
          const width = this.horizontal ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
          const height = this.vertical ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
          this.layout.addItem(new LayoutItem(width, height));
        }
        this.visibleEndIndex += needed;
      }

      this.visibleEndIndex = Math.min(count, this.visibleEndIndex);

      console.log('onUpdate', this.visibleStartIndex, this.visibleEndIndex, this.visibleEndIndex - this.visibleStartIndex);
      
      const unestimatedCount = this.itemCount - this.layout.count;
      const width = this.horizontal ? ITEM_INITIAL_SIZE : ITEM_INITIAL_SIZE;
      const height = this.vertical ? ITEM_INITIAL_SIZE : ITEM_INITIAL_SIZE;
      this.estimatedWidth = this.layout.width + unestimatedCount * width;
      this.estimatedHeight = this.layout.height + unestimatedCount * height;

      console.log('estimated', this.estimatedWidth, this.estimatedHeight);

      console.log(this);
    },
    expandLayout(lastIndex) {
      const { count } = this.layout;
      const ITEM_INITIAL_SIZE = 50;
      const LIST_VIEW_INITIAL_SIZE = 400;
      for (let index = count; index < lastIndex; index++) {
        const width = this.horizontal ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
        const height = this.vertical ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
        this.layout.addItem(new LayoutItem(width, height));
      }
    },
  },

  created() {
    this.layout = new BoxLayout(this.orientation);

    const ITEM_INITIAL_SIZE = 50;
    const LIST_VIEW_INITIAL_SIZE = 400;

    if (this.visibleEndIndex === 0) {
      this.visibleEndIndex = Math.ceil(LIST_VIEW_INITIAL_SIZE / ITEM_INITIAL_SIZE); 
    }

    const { count } = this.layout;

    for (let index = count; index < this.itemCount; index++) {
      const width = this.horizontal ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
      const height = this.vertical ? ITEM_INITIAL_SIZE : LIST_VIEW_INITIAL_SIZE;
      this.layout.addItem(new LayoutItem(width, height));
    }

    console.log('created', this.visibleStartIndex, this.visibleEndIndex);

    const unestimatedCount = this.itemCount - this.layout.count;
    const width = this.horizontal ? ITEM_INITIAL_SIZE : ITEM_INITIAL_SIZE;
    const height = this.vertical ? ITEM_INITIAL_SIZE : ITEM_INITIAL_SIZE;
    this.estimatedWidth = this.layout.width + unestimatedCount * width;
    this.estimatedHeight = this.layout.height + unestimatedCount * height;

    console.log('estimated', this.estimatedWidth, this.estimatedHeight);
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
