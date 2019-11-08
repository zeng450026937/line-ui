<template>
  <div class="list-item">
    <dynamic-node :vnode="cachedNode"></dynamic-node>
  </div>
</template>

<script>
import { DynamicNode } from '@/components/functional';

export default {
  name : 'ListItem',

  components : {
    DynamicNode,
  },

  inject : ['ListView'],

  props : {
    index : {
      type     : Number,
      required : true,
    },
    item : {
      type : [
        String, Number, Boolean, Array, Object, Date, Function, Symbol,
      ],
      default : () => ({}),
    },
  },

  computed : {
    cachedNode() {
      return this.$scopedSlots.default && this.$scopedSlots.default(this.item);
    },
  },

  methods : {
    onLayoutChanged() {
      const { itemLayoutAtIndex } = this.ListView;
      const item = itemLayoutAtIndex(this.index);
      this.offsetWidth = item.geometry.width;
      this.offsetHeight = item.geometry.height;

      const { offsetWidth, offsetHeight } = this.$el;
      const { onLayout, horizontal, vertical } = this.ListView;

      if (!offsetWidth || !offsetHeight) return;

      if ((this.offsetWidth !== offsetWidth && horizontal)
      || (this.offsetHeight !== offsetHeight && vertical)) {
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        onLayout(this.index, this.offsetWidth, this.offsetHeight);
      }
    },
  },

  created() {
    // console.debug('item created', this.index);
  },

  destroyed() {
    // console.debug('item destroyed', this.index);
  },

  async mounted() {
    // console.debug('item mounted', this.index);

    await this.$nextTick();

    // TBD
    // calc $el size is very heavy.
    this.onLayoutChanged();
  },

  async updated() {
    // console.debug('item updated', this.index);

    await this.$nextTick();
    // TBD
    // calc $el size is very heavy.
    this.onLayoutChanged();
  },
};
</script>

<style lang="scss">
.list-item {
  position: absolute;
}
</style>
