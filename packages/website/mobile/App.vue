<template>
  <div id="mobile-app">
    <keep-alive include="MobileHome">
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  created() {
    this.$router.push({
      name : 'mobile',
    });
  },
};
</script>

<style lang="scss">
* {
  margin: 0;

  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;

  overflow: hidden;
}
#mobile-app {
  width: 100%;
  height: 100%;

  background-color: #ffffff;
}
</style>
