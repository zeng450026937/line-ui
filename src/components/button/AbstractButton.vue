<script lang="ts">
import Vue, {
  VNode, VNodeChildren, VNodeData,
} from 'vue';
import { Icon } from '@/components/icon';
import { isObject, isEmpty } from '@/utils/helpers';
import { mergeListener } from './merge-listener';

export const Dispaly = {
  IconOnly       : 0,
  TextOnly       : 1,
  TextBesideIcon : 2,
  TextUnderIcon  : 3,
};

export default Vue.extend({
  name : 'AbstractButton',

  props : {
    action : {
      type    : Object,
      default : null,
    },
    display : {
      type    : Number,
      default : Dispaly.TextBesideIcon,
    },
    down : {
      type    : Boolean,
      default : false,
    },
    icon  : [String, Object],
    label : null as any,
  },

  computed : {
    cachedBackground(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.background;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genBackground();
    },
    cachedIndicator(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.indicator;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genIndicator();
    },
    cachedContent(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.content;
      if (slot) {
        const context = {};
        return slot(context);
      }
      return this.genContent();
    },
    cachedIcon(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.icon;
      if (slot) {
        const context = { icon: this.icon };
        return slot(context);
      }
      if (isEmpty(this.icon)) return null;
      if (this.display === Dispaly.TextOnly) return null;
      return this.genIcon();
    },
    cachedLabel(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.label;
      if (slot) {
        const context = { label: this.label };
        return slot(context);
      }
      if (isEmpty(this.label)) return null;
      if (this.display === Dispaly.IconOnly) return null;
      return this.genLabel();
    },
  },

  methods : {
    genBackground(): VNode | null { return null; },
    genIndicator(): VNode | null { return null; },
    genContent(): VNode | null {
      if (!this.cachedIcon && !this.cachedLabel) return null;
      const data = {
        staticClass : 'content',
      } as VNodeData;
      const children = [
        this.cachedIcon,
        this.cachedLabel,
      ] as VNodeChildren;
      return this.$createElement('div', data, children);
    },
    genIcon(): VNode {
      const props = isObject(this.icon) ? this.icon : { name: this.icon };
      return this.$createElement(Icon, { props });
    },
    genLabel(): VNode {
      return this.$createElement('div', String(this.label));
    },

    onClick(ev: UIEvent) {},
  },

  created() {
    (this as any).staticClass = 'abstract-button';
  },

  render(h): VNode {
    const tag = 'div';
    const on = {
      click : (ev: UIEvent) => this.onClick(ev),
    };
    const data = {
      staticClass : (this as any).staticClass,
      class       : (this as any).class,
      on          : mergeListener(on, this.$listeners),
    };
    const context = {};
    const children = [
      this.cachedBackground,
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
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  cursor: pointer;

  .content {
    display: flex;
    justify-items: center;
    flex-direction: column;
  }
}

</style>
