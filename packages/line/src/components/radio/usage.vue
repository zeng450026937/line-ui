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
        <line-radio-group v-model="groupValue" @change="onChange">
          <line-item>
            <template #start>
              <line-radio
                modelValue="Apple"
                :checked="value"
                color="primary"
                @change="toggled"
              ></line-radio>
            </template>
            <line-label>Apple</line-label>
          </line-item>
          <line-item>
            <template #start>
              <line-radio modelValue="Grape" color="dark"></line-radio>
            </template>
            <line-label>Grape</line-label>
          </line-item>
          <line-item>
            <template #start>
              <line-radio disabled modelValue="Cherry"></line-radio>
            </template>
            <line-label>Cherry</line-label>
          </line-item>
        </line-radio-group>
        <line-list-header>Pizza Topping</line-list-header>
        <line-item>
          <template #start>
            <line-radio color="secondary"></line-radio>
          </template>
          <line-label>Beef</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-radio color="danger"></line-radio>
          </template>
          <line-label>Anchovies</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-radio color="primary"></line-radio>
          </template>
          <line-label>Sausage</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-radio color="tertiary"></line-radio>
          </template>
          <line-label>Bellpepper</line-label>
        </line-item>
        <line-item>
          <line-label>Tomato</line-label>
          <template #end>
            <line-radio color="medium"></line-radio>
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

      groupValue: 'Apple',
    };
  },

  methods: {
    toggled(value) {
      this.value = value;
    },

    onChange(value) {
      console.log('onChange', value);
    },
  },

  watch: {
    groupValue(val, oldVal) {
      console.log(val, oldVal);
    },
  },
});
</script>

<style lang="scss" scoped></style>
