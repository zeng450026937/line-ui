<script lang="ts">
import Vue, {
  VNode, VNodeChildren, VNodeData,
} from 'vue';

export const Dispaly = {
  IconOnly: 0,
  TextOnly: 1,
  TextBesideIcon: 2,
  TextUnderIcon: 3,
};

export default Vue.extend({
  props: {
    action: {
      type: Object,
      default: null,
    },
    display: {
      type: Number,
      default: 0,
    },
    down: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: [String, Object],
      default: () => ({
        name: '',
        source: '',
        width: 24,
        height: 24,
        color: '',
      }),
    },
    text: String,
  },

  computed: {
    cachedIndicator(): VNodeChildren {
      const slot = this.$scopedSlots.indicator;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genIndicator();
    },
    cachedContent(): VNode {
      const data = {
        staticClass: 'content',
      } as VNodeData;
      const children = [
        this.cachedIcon,
        this.cachedLabel,
      ] as VNodeChildren;
      return this.$createElement('div', data, children);
    },
    cachedIcon(): VNodeChildren {
      const slot = this.$scopedSlots.icon;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genIcon();
    },
    cachedLabel(): VNodeChildren {
      const slot = this.$scopedSlots.label;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genLabel();
    },
  },

  methods: {
    genIndicator(): VNodeChildren { return null; },
    genIcon(): VNodeChildren { return null; },
    genLabel(): VNodeChildren { return null; },
  },

  render(h): VNode {
    const tag = 'div';
    const data = {
      staticClass: 'abstract-button',
      on: this.$listeners,
    };
    const children = [
      this.cachedIndicator,
      this.cachedContent,
      this.$scopedSlots.default && this.$scopedSlots.default(null),
    ];
    return h(tag, data, children);
  },
});
</script>

<style lang="scss">

.abstract-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;

  & .content {
    display: flex;
    justify-items: center;
    flex-direction: column;
  }
}

</style>
