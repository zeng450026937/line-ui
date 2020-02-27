<template>
  <div :class="bem()"
       ref="reference"
       v-remote="false">
    <div :class="bem('content')"
         v-show="visible"
         ref="content"
         :style="{width: `${clientWidth}px`}">
      <slot name="default"></slot>
    </div>
    <slot name="activator"
          v-bind:present="present"
          v-bind:dismiss="dismiss"></slot>
  </div>
</template>

<script>
import Popper, { Placement } from 'popper.js';
import { Popup } from 'skyline/components/popup';
// import { ClickOutsideMixin } from 'skyline/mixins/click-outside';
import { useGroup } from 'skyline/mixins/use-group';
import { createNamespace } from 'skyline/utils/namespace';

const NAMESPACE = 'Menu';
const [createComponent, bem, t] = createNamespace('menu');

export default {
  name    : 'Menu',
  extends : Popup,

  mixins : [
    useGroup(NAMESPACE),
    // ClickOutsideMixin({
    //   event  : 'click',
    //   method : 'onClickOutside',
    // }),
  ],

  props : {
    cascade : {
      type    : Boolean,
      default : false,
    },
    currentIndex : {
      type    : Number,
      default : 0,
    },
    delegate : {
      type    : Object,
      default : () => ({}),
    },
    overlap : {
      type    : Number,
      default : 0,
    },
    title : {
      type    : String,
      default : '',
    },
    placement : {
      type    : String,
      default : 'bottom',
    },
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  data() {
    return {
      visible     : false,
      clientWidth : 0,
    };
  },

  computed : {
    contentModel() {
      return {};
    },
    count() {
      return 0;
    },
    bem() {
      return bem;
    },
  },

  mounted() {
    this.clientWidth = this.$refs.reference.clientWidth;
  },

  beforeDestroy() {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  },

  methods : {
    onClickOutside() {
      this.visible = false;
    },
    present() {
      if (this.visible) {
        this.visible = false;
        return;
      }
      const { reference, content } = this.$refs;
      this.visible = true;
      this.popper = new Popper(reference, content, {
        placement     : this.placement,
        eventsEnabled : false,
        modifiers     : {
          flip            : { enabled: true },
          preventOverflow : {
            enabled             : true,
            escapeWithReference : true,
          },
        },
      });
    },
    dismiss() {
      this.visible = false;
    },

    popup() { },
    actionAt() { },
    addAction() { },
    addItem() { },
    addMenu() { },
    // dismiss() { },
    insertAction() { },
    insertItem() { },
    insertMenu() { },
    itemAt() { },
    menuAt() { },
    moveItem() { },
    removeAction() { },
    removeItem() { },
    removeMenu() { },
    takeAction() { },
    takeItem() { },
    takeMenu() { },
  },

  watch : {
    checkedItem(val) {
      this.visible = false;
      this.$emit('change', val);
    },
  },
};
</script>

<style lang="scss">
.line-menu {
  position: relative;
  &__content {
    min-height: 36px;

    padding: 0 10px;

    border-radius: 4px;

    background-color: #ffffff;

    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    z-index: 99;
  }
}
</style>
