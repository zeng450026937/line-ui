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
          <template #start>
            <line-switch v-model="value" color="primary"></line-switch>
          </template>
        </line-item>
        <line-item>
          <template #start>
            <line-switch color="dark"></line-switch>
          </template>
          <line-label>Apple</line-label>
        </line-item>
        <line-item disabled>
          <template #start>
            <line-switch></line-switch>
          </template>
          <line-label>Grape</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-switch color="secondary"></line-switch>
          </template>
          <line-label>Kiwi</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-switch color="danger"></line-switch>
          </template>
          <line-label>Orange</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-switch color="primary"></line-switch>
          </template>
          <line-label>Cherry</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-switch color="tertiary"></line-switch>
          </template>
          <line-label>Banana</line-label>
        </line-item>
        <line-item>
          <line-label>Tomato</line-label>
          <template #end>
            <line-switch color="medium"></line-switch>
          </template>
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
      checked: true,
      value: true,
    };
  },

  methods: {
    toggled(value) {
      this.value = value;
    },
  },

  watch: {
    value(value) {
      console.log('value', value);
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
