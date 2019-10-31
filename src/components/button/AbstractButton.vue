<script lang="ts">
import Vue, {
  VNode, VNodeChildren, VNodeData,
} from 'vue';
import { Icon } from '@/components/icon';
import { isObject } from '@/utils/helpers';
import { mergeListener } from './merge-listener';

export const Dispaly = {
  IconOnly: 0,
  TextOnly: 1,
  TextBesideIcon: 2,
  TextUnderIcon: 3,
};

export default Vue.extend({
  name: 'AbstractButton',

  props: {
    action: {
      type: Object,
      default: null,
    },
    display: {
      type: Number,
      default: Dispaly.TextBesideIcon,
    },
    down: {
      type: Boolean,
      default: false,
    },
    icon: [String, Object],
    text: String,
  },

  computed: {
    cachedIndicator(): VNodeChildren | VNode {
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
    cachedIcon(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.icon;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genIcon();
    },
    cachedLabel(): VNodeChildren | VNode {
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
    genIcon(): VNode | null {
      if (!this.icon) return null;
      if (this.display === Dispaly.TextOnly) return null;
      const props = isObject(this.icon) ? this.icon : { name: this.icon };
      return this.$createElement(Icon, { props });
    },
    genLabel(): VNode | null {
      if (!this.text) return null;
      if (this.display === Dispaly.IconOnly) return null;
      return this.$createElement('div', this.text);
    },

    onClick(ev: UIEvent) {},
  },

  created() {
    (this as any).staticClass = 'abstract-button';
  },

  render(h): VNode {
    const tag = 'div';
    const on = {
      click: (ev: UIEvent) => this.onClick(ev),
    };
    const data = {
      staticClass: (this as any).staticClass,
      class: (this as any).class,
      on: mergeListener(on, this.$listeners),
    };
    const context = {};
    const children = [
      this.cachedIndicator,
      this.cachedContent,
      this.$scopedSlots.default && this.$scopedSlots.default(context),
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
