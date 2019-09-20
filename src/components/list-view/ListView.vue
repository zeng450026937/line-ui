<template>
  <div class="list-view" ref="viewport">
    <div class="placement"></div>
    <div class="spacer" :style="{ 'padding-top': topSpace }"></div>
    <!-- <template v-if="!!$refs.viewport"> -->
    <template v-for="(item, index) in visiableList">
      <lifecycle-logger
        :tag="item.tag"
        :label="item.index"
        v-bind:key="item.text"
        class="item"
        v-observer="{viewport: $refs.viewport, callback: intersectionHandler, context: item}"
      >
        item {{item.text}}
      </lifecycle-logger>
    </template>
    <!-- </template> -->
  </div>
</template>

<script>
import observer from '@/directives/observer';
import { DynamicTag, LifecycleLogger } from '@/components/functional';

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

export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

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
    DynamicTag,
    LifecycleLogger,
  },

  directives: {
    observer,
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
      type: Object,
      default: () => ({}),
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
      default: 0,
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
    const itemCount = 50;
    const itemList = [];

    for (let index = 0; index < itemCount; index++) {
      itemList.push({ tag: `div${index}`, text: index, index });
    }

    return {
      index: 0,
      itemList,
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

    visiableList() {
      const bufferCount = 5;
      const maxCount = this.itemList.length;
      let start = this.index - bufferCount;
      let end = this.index + bufferCount;
      start = start < 0 ? 0 : start;
      end = end > maxCount ? maxCount : end;
      return this.itemList.slice(start, end);
    },
    topSpace() {
      const bufferCount = 5;
      let start = this.index - bufferCount;
      start = start < 0 ? 0 : start;
      return `${start * 200}px`;
    },
  },

  methods: {
    decrementCurrentIndex() {},
    forceLayout() {},
    incrementCurrentIndex() {},
    indexAt(x, y) {},
    itemAt(x, y) {},
    itemAtIndex(index) {},
    positionViewAtBeginning() {},
    positionViewAtEnd() {},
    positionViewAtIndex(index, mode) {},

    intersectionHandler(entries, ob, el, item) {
      const visable = Boolean(
        entries[0].isIntersecting || entries[0].intersectionRatio,
      );
      console.log('visable:', item.index, visable);
      if (visable && this.index > item.index) {
        this.index = item.index;
      }
      else if (!visable && this.index === item.index) {
        this.index++;
      }
      else if (visable && this.index > item.index) {
        this.index = item.index;
      }
      console.log('index:', this.index);
    },
  },

  mounted() {
    this.$emit('add');
    this.$emit('remove');
  },
};
</script>

<style lang="scss">
.list-view {
  position: relative;
  height: 200px;
  overflow: auto;

  .item {
    display: block;
    height: 200px;
    border: dotted palevioletred;
  }

  .placement {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10000px;
  }
}
</style>
