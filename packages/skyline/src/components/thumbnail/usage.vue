<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Thumbnail</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list-header>Default</line-list-header>
      <line-thumbnail class="line-margin-start">
        <img src="/avatar.svg">
      </line-thumbnail>

      <line-list>
        <line-list-header>Item Avatars</line-list-header>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>Lorem ipsum</line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Lorem ipsum</h3>
            <p>dolor sit amet</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Lorem ipsum</h3>
            <p>dolor sit amet</p>
            <p>consectetur adipiscing elit. Duis ut urna neque.</p>
          </line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>Lorem ipsum</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Lorem ipsum</h3>
            <p>dolor sit amet</p>
          </line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-thumbnail>
              <img src="/avatar.svg">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Lorem ipsum</h3>
            <p>dolor sit amet</p>
            <p>consectetur adipiscing elit. Duis ut urna neque.</p>
          </line-label>
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
