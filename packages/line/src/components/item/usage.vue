<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Image</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>
          Items with Labels
        </line-list-header>
        <line-item>
          <line-label>Label</line-label>
        </line-item>
        <line-item>
          <template #end>
            <line-icon name="logo"></line-icon>
          </template>
          <line-label>Label with Skyline</line-label>
        </line-item>
      </line-list>
      <line-list>
        <line-list-header>
          Color Items
        </line-list-header>
        <line-item color="primary">
          <line-label>Primary</line-label>
        </line-item>
        <line-item color="secondary">
          <line-label>Secondary</line-label>
        </line-item>
        <line-item color="tertiary">
          <line-label>Tertiary</line-label>
        </line-item>
        <line-item color="success">
          <line-label>Success</line-label>
        </line-item>
        <line-item color="warning">
          <line-label>Warning</line-label>
        </line-item>
        <line-item color="danger">
          <line-label>Danger</line-label>
        </line-item>
      </line-list>
      <line-list>
        <line-list-header>
          Group with Divider
        </line-list-header>
        <line-item-group>
          <line-item-divider>
            <line-label>A</line-label>
          </line-item-divider>
          <line-item>
            <line-label>Adam</line-label>
          </line-item>
          <line-item lines="none">
            <line-label>Alan</line-label>
          </line-item>
          <line-item-divider>
            <line-label>B</line-label>
          </line-item-divider>
          <line-item lines="none">
            <line-label>Brianna</line-label>
          </line-item>
          <line-item-divider>
            <line-label>C</line-label>
          </line-item-divider>
          <line-item lines="none">
            <line-label>Carla</line-label>
          </line-item>
        </line-item-group>
      </line-list>
      <line-list>
        <line-list-header>
          Sliding Item
        </line-list-header>
        <line-item-sliding>
          <line-item>
            <line-label>New Message</line-label>
          </line-item>
          <line-item-options side="start">
            <line-item-option color="primary">Mark Unread</line-item-option>
          </line-item-options>
          <line-item-options side="end">
            <line-item-option color="danger">Delete</line-item-option>
          </line-item-options>
        </line-item-sliding>
        <line-item-sliding>
          <line-item>
            <line-label>New Message</line-label>
          </line-item>
          <line-item-options side="start">
            <line-item-option color="primary">Mark Unread</line-item-option>
          </line-item-options>
          <line-item-options side="end">
            <line-item-option color="danger">Delete</line-item-option>
          </line-item-options>
        </line-item-sliding>
      </line-list>
      <line-list>
        <line-list-header>
          Notes
        </line-list-header>
        <line-item>
          <line-label>Primary Note</line-label>
          <template #end>
            <line-note color="primary">99</line-note>
          </template>
        </line-item>
        <line-item>
          <line-label>Secondary Note</line-label>
          <template #end>
            <line-note color="secondary">99</line-note>
          </template>
        </line-item>
        <line-item>
          <line-label>Tertiary Note</line-label>
          <template #end>
            <line-note color="tertiary">99</line-note>
          </template>
        </line-item>
        <line-item>
          <line-label>Success Note</line-label>
          <template #end>
            <line-note color="success">99</line-note>
          </template>
        </line-item>
        <line-item>
          <line-label>Warning Note</line-label>
          <template #end>
            <line-note color="warning">99</line-note>
          </template>
        </line-item>
        <line-item>
          <line-label>Danger Note</line-label>
          <template #end>
            <line-note color="danger">99</line-note>
          </template>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
