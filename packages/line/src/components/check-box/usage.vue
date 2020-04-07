<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>CheckBox</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>Characters</line-list-header>
        <line-check-box-group v-model="groupValue" @change="onChange">
          <line-item>
            <template #start>
              <line-check-box modelValue="1" color="primary"></line-check-box>
            </template>
            <line-label>Jon Snow</line-label>
          </line-item>
          <line-item>
            <template #start>
              <line-check-box modelValue="2" color="secondary"></line-check-box>
            </template>
            <line-label>Daenerys Targaryen</line-label>
          </line-item>
        </line-check-box-group>
        <line-item>
          <template #start>
            <line-check-box checked color="tertiary" disabled></line-check-box>
          </template>
          <line-label>Arya Stark</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box v-model="value" color="success"></line-check-box>
          </template>
          <line-label>Tyrion Lannister</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box color="danger" checked></line-check-box>
          </template>
          <line-label>Sansa Stark</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box color="warning" checked></line-check-box>
          </template>
          <line-label>Khal Drogo</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box color="medium" checked disabled></line-check-box>
          </template>
          <line-label>Cersei Lannister</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box color="medium" checked></line-check-box>
          </template>
          <line-label>Stannis Baratheon</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-check-box color="dark" checked></line-check-box>
          </template>
          <line-label>Petyr Baelish</line-label>
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

      groupValue: ['1', '2'],
    };
  },

  methods: {
    toggled(value) {
      this.value = value;
      this.test = value;
    },

    onChange(val) {
      console.log('onChange', val);
    },
  },

  watch: {
    value(val) {
      console.log('val', val);
    },

    groupValue(val) {
      console.log('groupValue', val);
    },
  },
});
</script>

<style lang="scss" scoped></style>
