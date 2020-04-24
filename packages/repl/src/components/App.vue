<template>
  <line-app>
    <line-content color="dark">
      <div class="logo">line-ui</div>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>

<style lang="scss">
:root {
  --code-fs: 1.3rem;
  --h6: 1.4rem;
  --h5: 1.6rem;
  --h4: 1.8rem;
  --h3: 2.6rem;
  --h2: 3rem;
  --h1: 3.2rem;
  --linemax: 42em;
  --lh: 1.5;
  --back: #ffffff;
  --back-light: #f6fafd;
  --back-api: #eff8ff;
  --prime: #ff3e00;
  --second: #676778;
  --flash: #40b3ff;
  --heading: var(--second);
  --text: #444;
  --sidebar-text: rgba(255, 255, 255, 0.75);
  --border-w: 0.3rem;
  --border-r: 0.4rem;
}

.logo {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: #fff;

  font-family: "Montserrat";
  font-size: 50px;

  line-height: 40px;

  text-transform: uppercase;
}
</style>
