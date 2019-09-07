<template>
  <div class="tumbler">
  </div>
</template>

<script>
export default {
  name: 'Tumbler',

  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    moving: {
      type: Boolean,
      default: true,
    },
    visibleItemCount: {
      type: Number,
      default: 0,
    },
    wrap: {
      type: Boolean,
      default: true,
    },
  },

  provide() {
    return {
      Tumbler: {
        displacement: this.displacement,
        tumbler: this,
      },
    };
  },

  computed: {
    count() {
      return 0;
    },
    currentItem() {
      return {};
    },
  },

  methods: {
    positionViewAtIndex() {},
  },
};
</script>

<style lang="scss">

</style>


const Tumbler = Control.extend({
  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    delegate: {
      type: Object,
      default: () => ({}),
    },
    model: {
      type: Object,
      default: () => ({}),
    },
    moving: {
      type: Boolean,
      default: true,
    },
    visibleItemCount: {
      type: Number,
      default: 0,
    },
    wrap: {
      type: Boolean,
      default: true,
    },
  },

  provide() {
    return {
      Tumbler: {
        displacement: this.displacement,
        tumbler: this,
      },
    };
  },

  computed: {
    count() {
      return 0;
    },
    currentItem() {
      return {};
    },
  },

  methods: {
    positionViewAtIndex() {},
  },
});

export default Tumbler;
