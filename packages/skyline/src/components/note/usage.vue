<template>
  <line-content fullscreen>
    <line-list>
      <line-list-header>Basic</line-list-header>
      <line-grid class="x-padding-left">
        <line-row>
          <line-col>
            <line-note>Default</line-note>
          </line-col>
          <line-col>
            <line-note color="primary">Primary</line-note>
          </line-col>
          <line-col>
            <line-note color="secondary">Secondary</line-note>
          </line-col>
          <line-col>
            <line-note color="tertiary">Tertiary</line-note>
          </line-col>
        </line-row>
        <line-row>
          <line-col>
            <line-note color="success">Success</line-note>
          </line-col>
          <line-col>
            <line-note color="warning">warning</line-note>
          </line-col>
          <line-col>
            <line-note color="danger">Danger</line-note>
          </line-col>
          <line-col>
            <line-note color="dark">Dark</line-note>
          </line-col>
        </line-row>

      </line-grid>

      <line-list-header>List Notes</line-list-header>
      <line-item>
        <line-label>Default</line-label>
        <line-note slot="end">11</line-note>
      </line-item>

      <line-item>
        <line-label>Primary</line-label>
        <line-note slot="end" color="primary">22</line-note>
      </line-item>

      <line-item>
        <line-label>Secondary</line-label>
        <line-note slot="end" color="secondary">33</line-note>
      </line-item>

      <line-item>
        <line-label>Tertiary</line-label>
        <line-note slot="end" color="tertiary">44</line-note>
      </line-item>

      <line-item>
        <line-label>Success</line-label>
        <line-note slot="start" color="success">55</line-note>
      </line-item>

      <line-item>
        <line-label>Warning</line-label>
        <line-note slot="start" color="warning">66</line-note>
      </line-item>

      <line-item>
        <line-label>Danger</line-label>
        <line-note slot="start" color="danger">77</line-note>
      </line-item>

      <line-item>
        <line-label>Dark</line-label>
        <line-note slot="start" color="dark">88</line-note>
      </line-item>
    </line-list>
  </line-content>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({

});
</script>

<style lang="scss" scoped>

.x-padding-left {
  padding-left: 15px;
}
.x-margin-botton {
  margin-bottom: 10px;
}
</style>
