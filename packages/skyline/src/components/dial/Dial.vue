<template>
  <div class="dial">
  </div>
</template>

<script>
export const InputMode = {
  Circular   : 0,
  Horizontal : 1,
  Vertical   : 2,
};

export const SnapMode = {
  NoSnap      : 0,
  SnapToItem  : 1,
  SnapOneItem : 2,
};

export default {
  name : 'Dial',

  props : {
    from : {
      type    : Number,
      default : 0,
    },
    handle : {
      type    : Object,
      default : () => ({}),
    },
    inputMode : {
      type    : Number,
      default : 0,
    },
    live : {
      type    : Boolean,
      default : true,
    },
    pressed : {
      type    : Boolean,
      default : false,
    },
    snapMode : {
      type    : Number,
      default : 0,
    },
    stepSize : {
      type    : Number,
      default : 0,
    },
    to : {
      type    : Number,
      default : 0,
    },
    value : {
      type    : Number,
      default : 0,
    },
    wrap : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    angle() {
      return 0;
    },
    position() {
      return '';
    },
    highlightedIndex() {
      return 0;
    },
  },

  methods : {
    decrease() {},
    increase() {},
  },

  created() {
    this.$emit('moved');
  },
};
</script>

<style lang="scss">

</style>
