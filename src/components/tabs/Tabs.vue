
<script>
import Vue from 'vue';
import { useGroup } from '@/components/group';

const NAMESPACE = 'Tabs';

export default Vue.extend({
  name: 'Tabs',

  mixins: [useGroup(NAMESPACE)],

  props: {
    exclusive: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    navBarStyle() {
      const { checkedItem, items } = this;
      const style = {
        width: '0px',
        transform: 'translateX(0px)',
      };

      if (checkedItem) {
        const item = items.find(el => el.value === checkedItem);

        if (item !== undefined) {
          const [clientRect, navClienRect] = [
            item.$el.getBoundingClientRect(),
            this.$refs.nav.getBoundingClientRect(),
          ];
          const translateX = clientRect.left - navClienRect.left;
          const { val, reduceVal } = this.getWH(item.$el, 'width');
          style.width = `${ val }px`;
          style.transform = `translateX(${ translateX + reduceVal }px)`;
        }
      }

      return style;
    },
  },

  created() {

  },

  mounted() {

  },

  methods: {
    getWH(el, name) {
      let val = name === 'width' ? el.offsetWidth : el.offsetHeight;
      const which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
      // display is none
      if (val === 0) {
        return 0;
      }
      let reduceVal = 0;
      const style = window.getComputedStyle(el, null);
      // 左右或上下两边的都减去
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

  watch: {

  },

  render(h) {
    const tag = 'div';
    const contentChildren = [];
    this.items.forEach((item, index) => {
      if (item.$slots.default) {
        contentChildren.push(
          h(tag, {
            ref: item.value || index,
            staticClass: 'tabs__content-pane',
            class: {
              'is-active': item.value === this.checkedItem,
            },
          }, item.$slots.default),
        );
      } else {
        contentChildren.push(h(tag, {
          staticClass: 'tabs__content-pane',
        }));
      }
    });

    const navBar = h(tag, {
      staticClass: 'tabs__nav-bar',
      style: this.navBarStyle,
    });
    const nav = h(tag, {
      ref: 'nav',
      staticClass: 'tabs__nav',
    }, [navBar, ...this.$slots.default]);
    const content = h(tag, {
      staticClass: 'tabs__content',
    }, contentChildren);


    return h(tag, {
      staticClass: 'tabs',
    }, [nav, content]);
  },
});
</script>

<style lang="scss">
.tabs {
  width: 100%;
  &__nav {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;

    &-item {
      flex: 0 1 auto;
      padding: 12px 20px;
      cursor: pointer;
    }
    &-bar {
      height: 2px;
      background-color: var(--primary);
      position: absolute;
      bottom: 0;
      transition: transform 0.3s, width 0.4s;
    }
  }

  &__content {
    &-pane {
      padding: 20px;
      display: none;
      &.is-active {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
