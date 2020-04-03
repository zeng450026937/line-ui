<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Image</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-list>
        <line-item v-for="item in items" :key="item.src">
          <template #start>
            <line-thumbnail>
              <img :src="item.src" />
            </line-thumbnail>
          </template>
          <line-label>{{ item.text }}</line-label>
        </line-item>

        <!-- lazy loading -->
        <line-list-header>
          Lazy Loading
        </line-list-header>

        <line-item lines="none">
          <line-label style="height: 400px;">
            <h2>scroll down</h2>
          </line-label>
        </line-item>

        <line-item v-for="item in lazyitems" :key="item.src">
          <template #start>
            <line-thumbnail>
              <line-img :src="item.src"></line-img>
            </line-thumbnail>
          </template>
          <line-label>{{ item.text }}</line-label>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      items: [
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'random world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'random world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'random world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'random world',
        },
      ],
      lazyitems: [
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'lazy world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'lazy world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'lazy world',
        },
        {
          src: `https://picsum.photos/200/300?${Math.random() * 1000}`,
          text: 'lazy world',
        },
      ],
    };
  },
});
</script>

<style lang="scss" scoped></style>
