<template>
  <div class="popup" v-show="visable" ref="popup">
    popup
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
    await this.$nextTick();
    const activator = this.$parent.$el;
    console.log(this.$refs.popup);
    this.popper = new Popper(
      activator,
      this.$refs.popup,
      {
        modifiers: {
          applyStyle: { enabled: false },
          applyVueStyle: {
            enabled: true,
            fn(data) {
              console.log(data);
            },
            order: 90,
          },
        },
      },
    );

    console.log(activator, this.popper);
  },
};
</script>

<style lang="scss">

</style>
