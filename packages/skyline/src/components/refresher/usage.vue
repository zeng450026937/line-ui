<template>
  <line-content>
    <template #fixed>
      <line-refresher
        @start="onStart"
        @pull="onPull"
        @refresh="refresh"
      >
        <line-refresher-content></line-refresher-content>
      </line-refresher>
    </template>

    <line-list>
      <line-item v-for="(item, index) in list" :key="index">
        <line-label>{{item}}</line-label>
      </line-item>
    </line-list>
  </line-content>
</template>

<script>

export default {
  data() {
    return {
      list : [],
    };
  },

  created() {
    for (let index = 0; index < 10; index++) {
      this.list.push(index + 1);
    }
  },

  methods : {
    onStart() {
      console.log('onStart');
    },
    onPull() {
      console.log('onPull');
    },
    refresh(data) {
      console.log(data);
      const { length } = this.list;
      const list = [];
      for (let index = length; index < length + 5; index++) {
        list.push(index + 1);
      }
      setTimeout(() => {
        const { complete } = data;
        this.list = [...this.list, ...list];
        complete && complete();
      }, 2000);
    },
  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.usage {
  width: 100%;
  height: 100%;
}
</style>
