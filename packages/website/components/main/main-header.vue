<template>
  <div class="main-header">
    <div class="main-header__logo">
      SkyLine-UI
    </div>
    <div class="main-header__nav">
      <span class="nav-item">搜索文档...</span>
      <span class="nav-item nav-button">首页</span>
      <span class="nav-item nav-button nav-item--active">组件</span>
      <span class="nav-item">1.00</span>
      <span class="nav-item">
        中文
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name : 'MainHeader',

  components : {

  },

  props : {

  },

  data() {
    return {

    };
  },

  computed : {

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
.main-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  height: 100%;

  padding: 0 20px;

  &__nav {
    display: flex;

    height: 100%;
    .nav-item {
      display: flex;

      align-items: center;

      height: 100%;

      padding: 0 20px;
    }
    .nav-button {
      cursor: pointer;
      &:hover {
        color: #10c29b;
      }
    }
    .nav-button.nav-item--active {
      position: relative;
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;

        width: 100%;

        border-top: 2px solid #10c29b;

        content: "";
      }
    }
  }
}
</style>
