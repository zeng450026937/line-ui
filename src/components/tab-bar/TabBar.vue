<template>
  <div class="tab-bar">
  </div>
</template>

<script>
export const Position = {
  Header: 0,
  Footer: 1,
};

export default {
  name: 'TabBar',

  props: {
    contentHeight: {
      type: Number,
      default: 0,
    },
    contentWidth: {
      type: Number,
      default: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
  },

  provide() {
    return {
      TabBar: {
        index: this.index,
        position: this.position,
        tabBar: this,
      },
    };
  },
};
</script>

<style lang="scss">

</style>
