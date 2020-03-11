<template>
  <line-content fullscreen>
    <line-list id="list">
      <line-item v-for="(item, index) in list" :key="index">{{item.text}}</line-item>
    </line-list>

    <line-infinite-scroll
      threshold="100px"
      id="infinite-scroll"
      :disabled="disabled"
      @infinite="onInfinite"
    >
      <line-infinite-scroll-content
        loading-spinner="bubbles"
        loading-text="Loading more data..."
      >
      </line-infinite-scroll-content>
    </line-infinite-scroll>
  </line-content>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      list     : [],
      disabled : false,
    };
  },

  created() {
    for (let i = 0; i < 20; i++) {
      this.list.push({ text: i } as never);
    }
  },

  methods : {
    async onInfinite(data: any) {
      const { complete } = data;
      const { length } = this.list;
      if (length > 30) {
        this.disabled = true;
        return;
      }
      await this.wait(500);

      for (let i = length; i < length + 10; i++) {
        this.list.push({ text: i } as never);
      }
      complete();
    },

    wait(time: number) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
