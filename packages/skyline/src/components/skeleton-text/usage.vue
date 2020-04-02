<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Skeleton-Text</line-title>
        <template #primary>
          <line-button @click="toggleSkeleton">Toggle</line-button>
        </template>
      </line-toolbar>
    </line-header>
    <line-content>
      <line-list v-if="displayData">
        <line-list-header>Albums</line-list-header>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-finn.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Abbey Road</h3>
            <p>The Beatles</p>
            <p>1969</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-han.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>The Dark Side of the Moon</h3>
            <p>Pink Floyd</p>
            <p>1973</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-rey.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>For Emma, Forever Ago</h3>
            <p>Bon Iver</p>
            <p>2008</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-luke.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Beast Epic</h3>
            <p>Iron & Wine</p>
            <p>2017</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-poe.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Worlds</h3>
            <p>Porter Robinson</p>
            <p>2014</p>
          </line-label>
        </line-item>
        <line-item>
          <template #start>
            <line-thumbnail>
              <img src="/avatar-ben.png">
            </line-thumbnail>
          </template>
          <line-label>
            <h3>Worlds</h3>
            <p>Awaken, My Love!</p>
            <p>2016</p>
          </line-label>
        </line-item>
      </line-list>
      <line-list v-else>
        <line-list-header>
          <line-skeleton-text
            animated
            style="width: 80px"
          ></line-skeleton-text>
        </line-list-header>
        <line-item
          v-for="(item, index) in 7"
          :key="index"
        >
          <template #start>
            <line-thumbnail>
              <line-skeleton-text></line-skeleton-text>
            </line-thumbnail>
          </template>
          <line-label>
            <h3>
              <line-skeleton-text
                animated
                style="width: 80%"
              ></line-skeleton-text>
            </h3>
            <p>
              <line-skeleton-text
                animated
                style="width: 60%"
              ></line-skeleton-text>
            </p>
            <p>
              <line-skeleton-text
                animated
                style="width: 30%"
              ></line-skeleton-text>
            </p>
          </line-label>
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
      displayData : false,
    };
  },

  methods : {
    toggleSkeleton() {
      this.displayData = !this.displayData;
    },
  },
});
</script>

<style lang="scss" scoped>
.line-progress-bar {
  margin: 10px 0;
}
</style>
