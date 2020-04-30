<template>
  <line-app>
    <line-header>
      <div id="header-wrapper">
        <h4>
          LINE-UI REPL <a :href="url" target="_blank">@{{ commit }}</a>
        </h4>
        <h6 id="options-wrapper">Line {{ version }} ↘</h6>
      </div>
    </line-header>

    <line-content>
      <Menu></Menu>
      <Repl></Repl>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Menu from './Menu.vue';
import Repl from './Repl/Repl.vue';

export default Vue.extend({
  name: 'App',
  components: { Menu, Repl },
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

      menu: true,
    };
  },
});
</script>

<style lang="scss">
#header-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: 0 1.6em;

  border-bottom: 1px solid #333;

  a {
    display: inline;
    font-weight: 600;
    font-size: 16px;
    color: rgb(101, 163, 221);
  }
}
</style>
