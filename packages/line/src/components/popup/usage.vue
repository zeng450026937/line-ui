<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Popup</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-popup ref="popup">
        test
      </line-popup>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {};
  },

  methods: {},

  mounted() {
    this.$refs.popup.open();
  },
});
</script>

<style lang="scss" scoped></style>
