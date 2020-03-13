<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Spinner</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-item>
          <line-label>Default</line-label>
          <line-spinner></line-spinner>
        </line-item>

        <line-item>
          <line-label>Lines</line-label>
          <line-spinner type="lines"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Lines Small</line-label>
          <line-spinner type="lines-small"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Dots</line-label>
          <line-spinner type="dots"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Bubbles</line-label>
          <line-spinner type="bubbles"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Circles</line-label>
          <line-spinner type="circles"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Crescent</line-label>
          <line-spinner type="crescent"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Paused</line-label>
          <line-spinner paused></line-spinner>
        </line-item>

        <line-item>
          <line-label>Primary</line-label>
          <line-spinner color="primary"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Secondary</line-label>
          <line-spinner color="secondary"></line-spinner>
        </line-item>

        <line-item>
          <line-label>Tertiary</line-label>
          <line-spinner color="tertiary"></line-spinner>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
</style>
