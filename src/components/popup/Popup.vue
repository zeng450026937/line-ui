<template>
  <div class="popup">
    <slot name="overlay">
      <div></div>
    </slot>
    <slot></slot>
  </div>
</template>

<script>
import Popper from 'popper.js';

export const ClosePolicy = {
  NoAutoClose: 0,
  CloseOnPressOutside: 1,
  CloseOnPressOutsideParent: 2,
  CloseOnReleaseOutside: 3,
  CloseOnReleaseOutsideParent: 4,
  CloseOnEscape: 5,
};

export default {
  name: 'Popup',

  props: {
    closePolicy: {
      type: Number,
      default: 0,
    },
    dim: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    visable: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    close() {},
    focus() {},
    open() {},
  },

  created() {
    // abstract signal defines
    this.$emit('aboutToHide');
    this.$emit('aboutToShow');
    this.$emit('closed');
    this.$emit('opened');
  },

  async mounted() {
    // const reference = this.$parent.$el;
    // this.popper = new Popper(reference, this.$el, {
    //   placement: 'bottom',
    //   eventsEnabled: false,
    //   modifiers: {
    //     flip: { enabled: false },
    //     preventOverflow: { enabled: true, escapeWithReference: true, boundariesElement: document.querySelector('.application-window') },
    //     applyStyle: { enabled: true },
    //     applyReactStyle: {
    //       enabled: true,
    //       fn(data) {
    //         console.log(data);
    //         return data;
    //       },
    //       order: 900,
    //     },
    //   },
    // });

    // await this.$nextTick();

    console.log(this.$el);

    const target = document.querySelector('main');
    console.log(target);
    target.insertBefore(
      this.$el,
      target.firstChild,
    );

    const reference = this.$parent.$el;
    this.popper = new Popper(reference, this.$el, {
      placement: 'bottom',
      eventsEnabled: false,
      modifiers: {
        flip: { enabled: false },
        preventOverflow: { 
          enabled: true,
          escapeWithReference: false,
          boundariesElement: target,
        },
        applyStyle: { enabled: true },
        applyCustomStyle: {
          enabled: true,
          fn(data) {
            console.log(data);
            return data;
          },
          order: 900,
        },
      },
    });
  },

  updated() {
    console.log('updated');
    this.popper.update();
  },

  beforeDestroy() {
    console.log('beforeDestroy');
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    
    this.popper.destroy();
    this.popper = null;
  },
};
</script>

<style lang="scss">

.popup {
  width: 100px;
  height: 100px;
  border: dotted plum;

  .reference {
    height: 30px;
    background-color: aquamarine;
  }
  .content {
    height: 30px;
    border: dotted red;
  }
}

</style>
