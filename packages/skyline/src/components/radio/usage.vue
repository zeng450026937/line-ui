<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Radio</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>Fruit</line-list-header>
        <line-item>
          <line-radio
            slot="start"
            :checked="value"
            color="primary"
            @toggled="toggled"
          ></line-radio>
          <line-label>Apple</line-label>
        </line-item>
        <line-item>
          <line-radio
            slot="start"
            color="dark"
          ></line-radio>
          <line-label>Grape</line-label>
        </line-item>
        <line-item disabled>
          <line-radio slot="start"></line-radio>
          <line-label>Cherry</line-label>
        </line-item>
        <line-list-header>Pizza Topping</line-list-header>
        <line-item>
          <line-radio
            slot="end"
            color="secondary"
          ></line-radio>
          <line-label>Beef</line-label>
        </line-item>
        <line-item>
          <line-radio
            slot="end"
            color="danger"
          ></line-radio>
          <line-label>Anchovies</line-label>
        </line-item>
        <line-item>
          <line-radio
            slot="end"
            color="primary"
          ></line-radio>
          <line-label>Sausage</line-label>
        </line-item>
        <line-item>
          <line-radio
            slot="end"
            color="tertiary"
          ></line-radio>
          <line-label>Bellpepper</line-label>
        </line-item>
        <line-item>
          <line-label>Tomato</line-label>
          <line-radio
            slot="end"
            color="medium"
          ></line-radio>
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
</style>
