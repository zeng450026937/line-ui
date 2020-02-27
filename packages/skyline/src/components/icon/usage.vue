<template>
  <line-content fullscreen>
    <line-list-header>FONT ICON</line-list-header>

    <section class="line-margin-start">
      <header>Small Size</header>
      <line-icon name="add" size="small" color="primary"></line-icon>
      <line-icon name="add" size="small" color="secondary"></line-icon>
      <line-icon name="add" size="small" color="tertiary"></line-icon>
    </section>

    <section class="line-margin-start">
      <header>Default Size</header>
      <line-icon name="add" color="success"></line-icon>
      <line-icon name="add" color="warning"></line-icon>
      <line-icon name="add" color="danger"></line-icon>
    </section>

    <section class="line-margin-start">
      <header>Large Size</header>
      <line-icon name="add" size="large" color="light"></line-icon>
      <line-icon name="add" size="large" color="medium"></line-icon>
      <line-icon name="add" size="large" color="dark"></line-icon>
    </section>

    <line-list-header>SVG ICON</line-list-header>

    <section class="line-margin-start">
      <header>Small Size</header>
      <line-icon source="/ionic-icons.symbols.svg" outline name="add" size="small" color="primary"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" size="small" color="secondary"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" size="small" color="tertiary"></line-icon>
    </section>

    <section class="line-margin-start">
      <header>Default Size</header>
      <line-icon source="/ionic-icons.symbols.svg" outline name="add" color="success"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" color="warning"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" color="danger"></line-icon>
    </section>

    <section class="line-margin-start">
      <header>Large Size</header>
      <line-icon source="/ionic-icons.symbols.svg" outline name="add" size="large" color="light"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" size="large" color="medium"></line-icon>
      <line-icon source="/ionic-icons.symbols.svg" name="add-circle" size="large" color="dark"></line-icon>
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

</style>
