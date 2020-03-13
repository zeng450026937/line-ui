<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Switch</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-item>
          <line-label>Blueberry</line-label>
          <line-switch
            slot="start"
            :checked="value"
            color="primary"
            @toggled="toggled"
          ></line-switch>
        </line-item>
        <line-item>
          <line-switch
            slot="start"
            color="dark"
          ></line-switch>
          <line-label>Apple</line-label>
        </line-item>
        <line-item disabled>
          <line-switch slot="start"></line-switch>
          <line-label>Grape</line-label>
        </line-item>
        <line-item>
          <line-switch
            slot="start"
            color="secondary"
          ></line-switch>
          <line-label>Kiwi</line-label>
        </line-item>
        <line-item>
          <line-switch
            slot="start"
            color="danger"
          ></line-switch>
          <line-label>Orange</line-label>
        </line-item>
        <line-item>
          <line-switch
            slot="end"
            color="primary"
          ></line-switch>
          <line-label>Cherry</line-label>
        </line-item>
        <line-item>
          <line-switch
            slot="end"
            color="tertiary"
          ></line-switch>
          <line-label>Banana</line-label>
        </line-item>
        <line-item>
          <line-label>Tomato</line-label>
          <line-switch
            slot="end"
            color="medium"
          ></line-switch>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      checked : true,
      value   : true,
    };
  },

  methods : {
    toggled(value) {
      this.value = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.badge-usage {
  width: 100%;
  height: 100%;

  // padding: 16px;
}
</style>
