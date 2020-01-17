<template>
  <line-content fullscreen>
    <section>
      <header>Small Size</header>
      <line-button size="small">Default</line-button>
      <line-button size="small" color="secondary">Secondary</line-button>
      <line-button size="small" color="tertiary">Tertiary</line-button>
    </section>

    <section>
      <header>Default Size</header>
      <line-button color="success">Success</line-button>
      <line-button color="warning">Warning</line-button>
      <line-button color="danger">Danger</line-button>
    </section>

    <section>
      <header>Large Size</header>
      <line-button size="large" color="light">Light</line-button>
      <line-button size="large" color="medium">Medium</line-button>
      <line-button size="large" color="dark">Dark</line-button>
    </section>

    <section>
      <header>Block Width</header>
      <line-button expand="block">A block button</line-button>
    </section>

    <section class="full-width">
      <header>Full Width</header>
      <line-button expand="full" color="secondary">A full-width button</line-button>
    </section>
  </line-content>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({

});
</script>

<style lang="scss" scoped>

header {
  margin-bottom: 1.25em;

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.05em;

  text-transform: uppercase;
}

section {
  margin-top: 1em;
  margin-bottom: 2.5em;
}

section:not(.full-width),
.full-width > header {
  padding: 0 10px;
}

</style>
