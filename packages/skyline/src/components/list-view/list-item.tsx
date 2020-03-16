import { createNamespace } from 'skyline/src/utils/namespace';

const NAMESPACE = 'ListView';
const { createComponent, bem } = /*#__PURE__*/ createNamespace('list-item');

export default /*#__PURE__*/ createComponent({
  inject : [NAMESPACE],

  props : {
    index : {
      type     : Number,
      required : true,
    },
    item : null as any,
  },

  computed : {
    cachedNode() {
      return this.slots('default', this.item);
    },
  },

  methods : {
    onLayoutChanged() {
      const { itemLayoutAtIndex } = this[NAMESPACE];
      const item = itemLayoutAtIndex(this.index);
      this.offsetWidth = item.geometry.width;
      this.offsetHeight = item.geometry.height;

      const { offsetWidth, offsetHeight } = this.$el as HTMLElement;
      const { onLayout, horizontal, vertical } = this[NAMESPACE];

      if (!offsetWidth || !offsetHeight) return;

      if ((this.offsetWidth !== offsetWidth && horizontal)
      || (this.offsetHeight !== offsetHeight && vertical)) {
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        onLayout(this.index, this.offsetWidth, this.offsetHeight);
      }
    },
  },

  async mounted() {
    await this.$nextTick();
    // this.onLayoutChanged();
  },

  async updated() {
    await this.$nextTick();
    // this.onLayoutChanged();
  },

  render() {
    return (
      <div class={bem()}>
        { this.cachedNode }
      </div>
    );
  },
});
