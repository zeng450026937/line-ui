<template>
  <div class="header-wrapper">
    <h4>
      LINE-UI REPL <a :href="url" target="_blank">@{{ commit }}</a>
    </h4>
    <h6>Line {{ version }} ↘</h6>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    const commit = __COMMIT__;
    const version = __VERSION__;
    const repo = 'http://gitcode.yealink.com/server/client/web_app/line-ui';
    const url = `${repo}/tree/${__COMMIT__}`;
    return {
      commit,
      version,
      repo,
      url,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-wrapper {
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 1.6em;

  background-color: rgba(#e6e6e6, 0.5);
  backdrop-filter: saturate(180%) blur(20px);

  a {
    color: rgb(101, 163, 221);

    font-size: 16px;
  }
}
</style>
