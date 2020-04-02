import { createNamespace } from '@line-ui/line/src/utils/namespace';
import {
  BoxLayout,
  LayoutItem,
  Orientation,
} from '@line-ui/line/src/utils/layout';
import { binarySearch } from '@line-ui/line/src/utils/algorithm/binary-search';
import { exponentialSearch } from '@line-ui/line/src/utils/algorithm/exponential-search';
import ListItem from '@line-ui/line/src/components/list-view/list-item';

const NAMESPACE = 'ListView';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('list-view');

export default /*#__PURE__*/ createComponent({
  provide() {
    return {
      [NAMESPACE] : this,
    };
  },

  props : {
    add : {
      type    : String,
      default : '',
    },
    addDisplaced : {
      type    : String,
      default : '',
    },
    cacheBuffer : {
      type    : Number,
      default : 3,
    },
    count : {
      type    : Number,
      default : 0,
    },
    currentIndex : {
      type    : Number,
      default : -1,
    },
    delegate : {
      type    : Object,
      default : () => ({}),
    },
    displaced : {
      type    : String,
      default : '',
    },
    displayMarginBeginning : {
      type    : Number,
      default : 0,
    },
    displayMarginEnd : {
      type    : Number,
      default : 0,
    },
    footer : {
      type    : Object,
      default : () => ({}),
    },
    footerPositioning : {
      type    : Number,
      default : 0,
    },
    header : {
      type    : Object,
      default : () => ({}),
    },
    headerPositioning : {
      type    : Number,
      default : 0,
    },
    highlight : {
      type    : Object,
      default : () => ({}),
    },
    highlightFollowsCurrentItem : {
      type    : Boolean,
      default : true,
    },
    highlightMoveDuration : {
      type    : Number,
      default : 1000,
    },
    highlightMoveVelocity : {
      type    : Number,
      default : -1,
    },
    highlightRangeMode : {
      type    : Number,
      default : 0,
    },
    highlightResizeDuration : {
      type    : Number,
      default : 0,
    },
    highlightResizeVelocity : {
      type    : Number,
      default : 0,
    },
    keyNavigationEnabled : {
      type    : Boolean,
      default : true,
    },
    keyNavigationWraps : {
      type    : Boolean,
      default : false,
    },
    layoutDirection : {
      type    : Number,
      default : 0,
    },
    model : {
      type    : [Object, Number, Array],
      default : () => ([]),
    },
    move : {
      type    : String,
      default : '',
    },
    moveDisplaced : {
      type    : String,
      default : '',
    },
    orientation : {
      type    : Number,
      default : Orientation.Vertical,
      validator(val) {
        return val === Orientation.Vertical || val === Orientation.Horizontal;
      },
    },
    populate : {
      type    : String,
      default : '',
    },
    preferredHighlightBegin : {
      type    : Number,
      default : 0,
    },
    preferredHighlightEnd : {
      type    : Number,
      default : 0,
    },
    remove : {
      type    : String,
      default : '',
    },
    removeDisplaced : {
      type    : String,
      default : '',
    },
    section : {
      type    : Object,
      default : () => ({
        property         : '',
        criteria         : 0,
        delegate         : null,
        labelPositioning : 0,
      }),
    },
    snapMode : {
      type    : Number,
      default : 0,
    },
    spacing : {
      type    : Number,
      default : 0,
    },
    verticalLayoutDirection : {
      type    : String,
      default : '',
    },
  },

  computed : {
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

  methods : {
    decrementCurrentIndex() { /* TBD */ },
    forceLayout() { /* TBD */ },
    incrementCurrentIndex() { /* TBD */ },
    indexAt(x: number, y: number) {
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
    itemAt(x: number, y: number) {
      const index = this.indexAt(x, y);
      return this.itemAtIndex(index);
    },
    itemAtIndex(index: number) {
      if (Array.isArray(this.model)) {
        return this.model[index];
      }
      return index;
    },
    positionViewAtBeginning() { /* TBD */ },
    positionViewAtEnd() { /* TBD */ },
    positionViewAtIndex(index: number, mode: number) {
      index; mode;
    },

    itemLayoutAt(x: number, y: number) {
      const index = this.indexAt(x, y);
      return this.layout.itemAt(index);
    },
    itemLayoutAtIndex(index: number) {
      return this.layout.itemAt(index);
    },
    itemStyleAtIndex(index: number) {
      const { geometry } = this.layout.itemAt(index);
      return Object.freeze({
        left   : `${ geometry.left }px`,
        top    : `${ geometry.top }px`,
        width  : this.horizontal ? 'auto' : '100%',
        height : this.horizontal ? '100%' : 'auto',
      });
    },
    mapToItemIndex(visibleIndex: number) {
      return this.from + visibleIndex;
    },

    itemViewAt(id: string) {
      return this.views[id];
    },
    itemViewAtIndex(index: number) {
      const viewId = Object.keys(this.views).find(id => this.views[id].index === index);
      return this.itemViewAt(viewId as string);
    },

    addView(view: any) {
      const count = Object.keys(this.views).length;
      const { id = count } = view;
      view.id = id;
      this.views[id] = view;
    },
    removeView(id: string) {
      delete this.views[id];
      delete this.cachedViews[id];
    },
    cacheView(id: string) {
      const view = this.views[id];
      view.style = { ...this.itemStyleAtIndex(view.index), display: 'none' };
      this.cachedViews[id] = view;
    },

    onScroll(event: UIEvent) {
      const { scrollLeft, scrollTop } = event.target as HTMLElement;

      const threshold = this.minimumItemSize;
      // const threshold = 16;
      if (Math.abs(this.scrollLeft - scrollLeft) >= threshold
      || Math.abs(this.scrollTop - scrollTop) >= threshold
      ) {
        // const dx = scrollLeft - this.scrollLeft;
        // const dy = scrollTop - this.scrollTop;
        this.incremental = this.horizontal
          ? scrollLeft > this.scrollLeft
          : scrollTop > this.scrollTop;
        this.decremental = !this.incremental;

        this.scrollLeft = scrollLeft;
        this.scrollTop = scrollTop;

        if (!this.pending) {
          this.onUpdate();
        }
      }
    },
    async onLayout(index: number, offsetWidth: number, offsetHeight: number) {
      const item = this.layout.itemAt(index);
      item.setSize(offsetWidth, offsetHeight);

      this.minimumItemSize = Math.min(
        this.minimumItemSize, this.horizontal ? offsetWidth : offsetHeight,
      );
      this.maximumItemSize = Math.max(
        this.maximumItemSize, this.horizontal ? offsetWidth : offsetHeight,
      );

      this.dirtyIndex = Math.min(this.dirtyIndex, index);

      // if (!this.pending) {
      //   this.pending = true;
      //   await this.$nextTick();
      //   this.layout.update(this.dirtyIndex);
      //   this.dirtyIndex = this.layout.count;
      //   this.onUpdate(true);
      //   this.pending = false;
      // }
      if (!this.pending) {
        this.pending = requestAnimationFrame(() => {
          this.layout.update(this.dirtyIndex);
          this.dirtyIndex = this.layout.count;
          this.onUpdate(true);
          this.pending = false;
        });
      }
    },
    async onUpdate(force = false) {
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

      let newFrom: number;
      let newTo: number;

      newFrom = binarySearch(
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
        this.incremental ? lastFrom : Math.floor(leftBoundary / this.maximumItemSize),
        this.incremental ? Math.min(
          count - 1, Math.ceil(leftBoundary / this.minimumItemSize),
        ) : lastTo,
      );

      if (total > rightBoundary) {
        newTo = exponentialSearch(
          this.layout.items,
          rightBoundary,
          (item: any, wanted: any) => {
            const {
              left, right, top, bottom,
            } = item.geometry;
            const leftBound = this.horizontal ? left : top;
            const rightBound = this.horizontal ? right : bottom;
            if (rightBound < wanted) { return -1; }
            if (leftBound > wanted) { return 1; }
            return 0;
          },
          newFrom,
          count - 1,
        );
      } else {
        newTo = count - 1;
      }

      newFrom = Math.max(0, newFrom);
      newTo = Math.min(count - 1, newTo);

      Object.keys(this.views).forEach((id) => {
        const view = this.views[id];
        const { index } = view;
        if (index < newFrom || index > newTo) {
          this.cacheView(id);
        } else {
          view.style = this.itemStyleAtIndex(index);
        }
      });

      let avaliable = Object.keys(this.cachedViews);
      for (let index = newFrom; index <= newTo; index++) {
        if (index < lastFrom || index > lastTo) {
          let view = this.itemViewAtIndex(index);

          if (view) {
            delete this.cachedViews[view.id];
            view.style = this.itemStyleAtIndex(index);
            avaliable = Object.keys(this.cachedViews);
            continue;
          } else if (avaliable.length) {
            const id = avaliable.shift();
            view = this.cachedViews[id!];
            delete this.cachedViews[id!];
          } else {
            view = {};
            this.addView(view);
          }
          view.index = index;
          view.layout = this.layout.itemAt(index);
          view.item = this.itemAtIndex(index);
          view.style = this.itemStyleAtIndex(index);
        }
      }

      if (force || (newFrom !== lastFrom || newTo !== lastTo)) {
        this.from = newFrom;
        this.to = newTo;
        this.$forceUpdate();
      }
    },
  },

  beforeMount() {
    const ITEM_INITIAL_SIZE = 50;
    const LIST_VIEW_INITIAL_SIZE = 500;
    const count = LIST_VIEW_INITIAL_SIZE / ITEM_INITIAL_SIZE;

    this.layout = new BoxLayout(this.orientation);
    this.layout.setCount(this.itemCount, () => new LayoutItem(50, 50));

    this.views = Object.create(null);
    this.cachedViews = Object.create(null);

    this.from = 0;
    this.to = Math.min(count - 1, this.itemCount);

    this.minimumItemSize = ITEM_INITIAL_SIZE;
    this.maximumItemSize = ITEM_INITIAL_SIZE;

    this.dirtyIndex = this.itemCount;
    this.pending = false;

    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.incremental = true;
    this.decremental = false;

    // init view
    for (let index = this.from; index <= this.to; index++) {
      this.addView({
        index,
        layout : this.layout.itemAt(index),
        item   : this.itemAtIndex(index),
        style  : this.itemStyleAtIndex(index),
      });
    }
  },

  async mounted() {
    this.$emit('add');
    this.$emit('remove');

    const viewport = this.$refs.viewport as HTMLElement;
    this.clientWidth = viewport.clientWidth;
    this.clientHeight = viewport.clientHeight;

    await this.$nextTick();
  },

  render() {
    return (
      <div
        class={bem()}
        ref="viewport"
        onScroll={this.onScroll}
      >
        <div
          class={bem('spacer')}
          style={{
            width  : `${ this.layout.geometry.width }px`,
            height : `${ this.layout.geometry.height }px`,
          }}
        ></div>

        <transition-group
          tag={'div'}
          class={bem('content')}
        >
          {
            Object.keys(this.views).map((index: any) => {
              const view = this.views[index];
              return (
                <ListItem
                  key={view.id}
                  index={view.index}
                  item={view.item}
                  style={view.style}
                  scopedSlots={{
                    default : () => {
                      return this.slots('delegate') || view.index;
                    },
                  }}
                >
                </ListItem>
              );
            })
          }
        </transition-group>
      </div>
    );
  },
});
