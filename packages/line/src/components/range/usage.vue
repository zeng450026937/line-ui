<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Range</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>
          Adjust Display
        </line-list-header>

        <line-item>
          <line-range :value="20">
            <template #start>
              <line-icon size="small" name="wb_sunny"></line-icon>
            </template>
            <template #end>
              <line-icon name="wb_sunny"></line-icon>
            </template>
          </line-range>
        </line-item>

        <line-item>
          <line-range :min="-200" :max="200" pin color="secondary">
            <template #start>
              <line-icon size="small" name="ac_unit"></line-icon>
            </template>
            <template #end>
              <line-icon name="ac_unit"></line-icon>
            </template>
          </line-range>
        </line-item>

        <line-item>
          <line-range id="dual-range" dual-knobs pin color="dark">
            <template #start>
              <line-icon size="small" name="brush"></line-icon>
            </template>
            <template #end>
              <line-icon name="brush"></line-icon>
            </template>
          </line-range>
        </line-item>

        <line-item>
          <line-range
            :min="1000"
            :max="2000"
            :step="100"
            :value="1400"
            snaps
            ticks
            color="danger"
          >
            <template #start>
              <line-icon
                size="small"
                color="danger"
                name="flash_on"
              ></line-icon>
            </template>
            <template #end>
              <line-icon color="danger" name="flash_on"></line-icon>
            </template>
          </line-range>
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
});
</script>

<style lang="scss" scoped></style>
