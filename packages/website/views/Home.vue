<template>
  <section class="home">
    <header class="home__header">
      <home-header></home-header>
    </header>
    <div class="home__sidebar">
      <navigation :list="list"></navigation>
    </div>
    <div class="home__content">
      <div class="content__docs">
        <router-view></router-view>
      </div>
      <div class="content__demo">
        <div class="demo__top">
          <line-icon name="alarm"
                     width="16"
                     height="16"></line-icon>
          <line-icon name="signal_wifi_off"
                     width="16"
                     height="16"></line-icon>
          <line-icon name="signal_cellular_connected_no_internet_4_bar"
                     width="16"
                     height="16"></line-icon>
          <line-icon name="battery_full"
                     width="16"
                     height="16"></line-icon>
          17:37
        </div>
        <iframe ref="device"
                src="/mobile.html"
                frameborder="0"
                style="width: 340px; height: 680px"></iframe>
        <div class="demo__bottom"></div>
      </div>
    </div>
  </section>
</template>

<script>
import HomeHeader from '../components/main/main-header.vue';
import Navigation from '../components/main/main-navigation.vue';
import { Icon as LineIcon } from '@/components/icon';
import { navList } from '../utils/navigation.mobile';

export default {
  name       : 'Home',
  components : {
    Navigation,
    HomeHeader,
    LineIcon,
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
    const { device } = this.$refs;
    device.onload = () => {
      this.changePath(this.$route);
    };
  },

  methods : {
    changePath(route) {
      const { name } = route;
      const { device } = this.$refs;
      if (this.$route.meta.displayDemo && device) {
        device.contentWindow.router.push({ name: `demo-${ name }` });
      }
    },
  },

  watch : {
    $route(value) {
      this.changePath(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;

  height: 100%;

  padding-top: 68px;

  &__header {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 68px;

    border-bottom: 1px solid #ebebeb;

    background-color: #ffffff;

    z-index: 99;
  }
  &__sidebar {
    position: fixed;
    top: 68px;

    flex-shrink: 0;

    width: 260px;
    height: 100%;

    border-right: 1px solid #ebebeb;
  }
  &__content {
    display: flex;

    flex-grow: 1;

    height: 100%;

    margin-left: 260px;

    padding: 0 120px;

    overflow: auto;

    .content__docs {
      flex-grow: 1;

      padding-right: 120px;
    }
    .content__demo {
      display: flex;
      position: sticky;
      top: 40px;

      flex-direction: column;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;

      width: 360px;
      height: 700px;

      border: 15px solid #1a1a1a;
      border-right-width: 10px;
      border-left-width: 10px;
      border-radius: 30px;

      background-color: #1a1a1a;

      box-shadow: 0 0px 6px 6px rgba(0, 0, 0, 0.15);

      &::before {
        position: absolute;
        top: 20px;
        right: 0;
        bottom: 20px;
        left: 0;

        background-color: #ffffff;

        content: "";
        z-index: -1;
      }

      .demo__top,
      .demo__bottom {
        flex-shrink: 0;

        width: 340px;
        height: 20px;

        background-color: #ffffff;
        color: #1a1a1a;
      }
      .demo__top {
        display: flex;

        align-items: center;
        justify-content: flex-end;

        padding-right: 10px;

        border-top-left-radius: 40px;
        border-top-right-radius: 40px;

        font-size: 8px;

        i {
          margin: 0 2px;
        }
      }
      .demo__bottom {
        display: flex;
        position: relative;

        justify-content: center;

        border-bottom-left-radius: 40px;
        border-bottom-right-radius: 40px;

        &::before {
          display: block;

          position: absolute;
          bottom: 6px;

          width: 120px;
          height: 4px;

          border-radius: 2px;

          background-color: rgba(0, 0, 0, 0.5);

          content: "";
          z-index: 1;
        }
      }
    }
  }
}
</style>
