<template>
  <div>
    <div>Template Explorer</div>
    <header>
      <h1>I'm a template!</h1>
    </header>
    <p v-if="message">{{ message }}</p>
    <p v-else>No message.</p>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  created() {
    setTimeout(() => {
      const compiled = Vue.compile(`
      <div>
        <header>Template Explorer</header>
        <p>I'm a template!</p>
      </div>
      `);
      this.$options.render = compiled.render;
      this.$options.staticRenderFns = compiled.staticRenderFns;
      this._staticTrees = [];
      console.log('bang!!!');
      this.$forceUpdate();
    }, 3000);
  },
};
</script>
