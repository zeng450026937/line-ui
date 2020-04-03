<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Card</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-card>
        <img src="/madison.jpg" />

        <line-card-header>
          <line-card-subtitle>Destination</line-card-subtitle>
          <line-card-title>Madison, WI</line-card-title>
        </line-card-header>

        <line-card-content>
          Founded in 1829 on an isthmus between Lake Monona and Lake Mendota,
          Madison was named the capital of the Wisconsin Territory in 1836.
        </line-card-content>
      </line-card>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped></style>
