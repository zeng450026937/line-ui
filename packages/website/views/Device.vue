<template>
  <div class="device-container">
    <div class="device__nav">
      <span class="nav__back-button" @click="goBack">
        <line-icon name="chevron_left"></line-icon>
      </span>
      <span class="nav__title">
        {{ title }}
      </span>
    </div>
    <device></device>
  </div>
</template>

<script>
import { Icon as LineIcon } from '@/components/icon';
import Device from '../components/mobile/mobile.vue';

export default {
  name: 'MainDevice',

  components: {
    Device,
    LineIcon,
  },

  props: {},

  data() {
    return {};
  },

  computed: {
    title() {
      return this.$route.meta.title;
    },
  },

  created() {},

  mounted() {},

  methods: {
    goBack() {
      this.$router.push({
        name: 'mobile',
      });
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.device-container {
  display: flex;
  position: relative;

  flex-direction: column;

  width: 100%;
  height: 100%;

  .device__nav {
    display: flex;
    position: static;

    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 48px;

    padding: 0 20px;

    border-bottom: 1px solid #ebebee;

    box-shadow: 0px 2px 4px 0px rgba($color: #000000, $alpha: 0.1);
    z-index: 99;

    .nav__back-button {
      cursor: pointer;
    }
    .nav__title {
      font-size: 18px;
    }
  }
}
</style>
