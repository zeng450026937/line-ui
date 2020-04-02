<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Note</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
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
          <template #end>
            <line-note>11</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Primary</line-label>
          <template #end>
            <line-note color="primary">22</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Secondary</line-label>
          <template #end>
            <line-note color="secondary">33</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Tertiary</line-label>
          <template #end>
            <line-note color="tertiary">44</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Success</line-label>
          <template #start>
            <line-note color="success">55</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Warning</line-label>
          <template #start>
            <line-note color="warning">66</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Danger</line-label>
          <template #start>
            <line-note color="danger">77</line-note>
          </template>
        </line-item>

        <line-item>
          <line-label>Dark</line-label>
          <template #start>
            <line-note color="dark">88</line-note>
          </template>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.x-padding-left {
  padding-left: 15px;
}
.x-margin-botton {
  margin-bottom: 10px;
}
</style>
