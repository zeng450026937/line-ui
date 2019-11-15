import { useGroup } from '@/components/group';
import { createNamespace } from '@/utils/namespace';
import '@/components/tabs/tabs.scss';

const NAMESPACE = 'Tabs';
const [createComponent, bem] = createNamespace('tabs');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  computed : {
    navBarStyle(): object {
      const { checkedItem, items } = this;
      const style = {
        width     : '0px',
        transform : 'translateX(0px)',
      };

      if (checkedItem) {
        const item = items.find((el: any) => el.value === checkedItem);

        if (item !== undefined) {
          const [clientRect, navClientRect] = [
            item.$el.getBoundingClientRect(),
            (this.$refs.nav as Element).getBoundingClientRect(),
          ];
          const translateX = clientRect.left - navClientRect.left;
          const { val, reduceVal }: {val: number, reduceVal:number } = this.getWH(item.$el, 'width');
          style.width = `${ val }px`;
          style.transform = `translateX(${ translateX + reduceVal }px)`;
        }
      }

      return style;
    },
  },

  methods : {
    getWH(el: any, name: String): {val: number, reduceVal: number} {
      let val = name === 'width' ? el.offsetWidth : el.offsetHeight;
      const which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
      // display is none
      if (val === 0) {
        return { val: 0, reduceVal: 0 };
      }
      let reduceVal = 0;
      const style: any = window.getComputedStyle(el, null);
      // 减去左右或上下
      /* eslint-disable-next-line */
      for (let i = 0, position; position = which[i++];) {
        const [border = 0, padding = 0] = [
          parseFloat(style[`border${ position }Width`]),
          parseFloat(style[`padding${ position }`]),
        ];
        reduceVal = position === 'Left' ? reduceVal + border + padding : reduceVal;
        val = val - border - padding;
      }
      return { val, reduceVal };
    },
  },

  render(h) {
    const tag = 'div';
    const contentChildren: any[] = [];
    this.items.forEach((item: any, index: number) => {
      if (item.$slots.default) {
        contentChildren.push(
          h(tag, {
            ref         : item.value || index,
            staticClass : 'tabs__content-pane',
            class       : {
              'is-active' : item.value === this.checkedItem,
            },
          }, item.$slots.default),
        );
      } else {
        contentChildren.push(h(tag, {
          staticClass : 'tabs__content-pane',
        }));
      }
    });
    const navBar = h(tag, {
      staticClass : 'tabs__nav-bar',
      style       : this.navBarStyle,
    });

    const navChildren = this.$slots.default;
    navChildren!.push(navBar);
    const nav = h(tag, {
      ref         : 'nav',
      staticClass : 'tabs__nav',
    }, navChildren);

    const content = h(tag, {
      staticClass : 'tabs__content',
    }, contentChildren);

    return h(tag, {
      staticClass : 'tabs',
    }, [nav, content]);
  },

});
