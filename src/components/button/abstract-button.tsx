import Vue, {
  VNode, VNodeChildren, VNodeData,
} from 'vue';
import { Icon } from '@/components/icon';
import { isObject, isEmpty } from '@/utils/helpers';
import { mergeListener } from './merge-listener';
import { createNamespace } from '@/utils/namespace';
import '@/components/button/abstract-button.scss';

export const Display = {
  IconOnly       : 0,
  TextOnly       : 1,
  TextBesideIcon : 2,
  TextUnderIcon  : 3,
};

const [createComponent, bem] = createNamespace('abstract-button');

export default createComponent({
  components : {
    Icon,
  },

  props : {
    action : {
      type    : Object,
      default : null,
    },
    display : {
      type    : Number,
      default : Display.TextBesideIcon,
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
      if (this.display === Display.TextOnly) return null;
      return this.genIcon();
    },
    cachedLabel(): VNodeChildren | VNode {
      const slot = this.$scopedSlots.label;
      if (slot) {
        const context = { label: this.label };
        return slot(context);
      }
      if (isEmpty(this.label)) return null;
      if (this.display === Display.IconOnly) return null;
      return this.genLabel();
    },
  },

  created() {
    (this as any).staticClass = 'abstract-button';
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
