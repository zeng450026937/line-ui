<template>
   <div class="mobile-home">
     <div class="mobile-home__info">
       <p class="info__subject">SKYLINE</p>
       <p class="info__detail">
        XXXXX, XXXXXXXXXXXXXXXXX。XXXXXXXXXXX, xxxxxxxxxxxx, xxxxxxxxxxxxxxxxxxx。
       </p>
     </div>
     <mobile-navigation :list="list"></mobile-navigation>
   </div>
</template>

<script>
import { navList } from '../utils/navigation.mobile';
import MobileNavigation from '../components/mobile/mobile-navigation.vue';

export default {
  name : 'MobileHome',

  components : {
    MobileNavigation,
  },

  props : {

  },

  data() {
    return {

    };
  },

  computed : {
    list() {
      return navList;
    },
  },

  created() {

  },

  mounted() {

  },

  methods : {

  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.mobile-home {
  display: flex;

  flex-direction: column;


  width: 100%;
  height: 100%;

  padding: 0 20px;

  overflow: auto;

  &::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

  &__info {
    padding: 20px 0;

    .info__subject {
      padding-bottom: 20px;

      color: #1a1a1a;

      font-size: 24px;
      font-weight: 600;
    }

    .info__detail {
      color: #666;
    }
  }
}
</style>
