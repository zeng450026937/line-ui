<template>
  <div class="tab-bar"
       :class="{'is--header': position === 0,
                'is--footer': position === 1}">
    <slot name="default"></slot>
  </div>
</template>

<script>
import { useGroup } from '@/components/group';

export const Position = {
  Header : 0,
  Footer : 1,
};
const NAMESPACE = 'TabBar';

export default {
  name : 'TabBar',

  mixins : [useGroup(NAMESPACE)],

  props : {
    contentHeight : {
      type    : Number,
      default : 0,
    },
    contentWidth : {
      type    : Number,
      default : 0,
    },
    position : {
      type    : Number,
      default : 0,
    },
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  // provide() {
  //   return {
  //     TabBar: {
  //       index: this.index,
  //       position: this.position,
  //       tabBar: this,
  //     },
  //   };
  // },
};
</script>

<style lang="scss">
.tab-bar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  padding: 10px 0;
  &.is--header {
    width: 100%;
  }
  &.is--footer {
    width: 100%;
  }
}
</style>
