<template>
  <div class="device">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name : 'Device',

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
.device {
  flex-grow: 1;

  width: 100%;

  margin-top: 15px;

  background-color: #fff;

  overflow: auto;
}
.device::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
</style>
