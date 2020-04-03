<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Chip</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-list-header>Basic</line-list-header>
      <p>
        <line-chip>
          <line-label>Default</line-label>
        </line-chip>
        <line-chip>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="checkmark-circle"
          ></line-icon>
          <line-label>Icon</line-label>
        </line-chip>
        <line-chip>
          <line-avatar>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjYzVkYmZmIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBkPSJNMjU2IDMwNGM2MS42IDAgMTEyLTUwLjQgMTEyLTExMlMzMTcuNiA4MCAyNTYgODBzLTExMiA1MC40LTExMiAxMTIgNTAuNCAxMTIgMTEyIDExMnptMCA0MGMtNzQuMiAwLTIyNCAzNy44LTIyNCAxMTJ2NTZoNDQ4di01NmMwLTc0LjItMTQ5LjgtMTEyLTIyNC0xMTJ6IiBmaWxsPSIjODJhZWZmIi8+PC9zdmc+"
            />
          </line-avatar>
          <line-label>Avatar</line-label>
        </line-chip>
      </p>

      <line-list-header>Colors</line-list-header>
      <p>
        <line-chip color="primary">
          <line-label>Primary</line-label>
        </line-chip>
        <line-chip color="secondary">
          <line-label>Secondary</line-label>
        </line-chip>
        <line-chip color="tertiary">
          <line-label>Tertiary</line-label>
        </line-chip>
        <line-chip color="success">
          <line-label>Success</line-label>
        </line-chip>
        <line-chip color="warning">
          <line-label>Warning</line-label>
        </line-chip>
        <line-chip color="danger">
          <line-label>Danger</line-label>
        </line-chip>
      </p>

      <line-list-header>Outline</line-list-header>
      <p>
        <line-chip outline color="primary">
          <line-label>Primary</line-label>
        </line-chip>
        <line-chip outline color="secondary">
          <line-label>Secondary</line-label>
        </line-chip>
        <line-chip outline color="tertiary">
          <line-label>Tertiary</line-label>
        </line-chip>
        <line-chip outline color="success">
          <line-label>Success</line-label>
        </line-chip>
        <line-chip outline color="warning">
          <line-label>Warning</line-label>
        </line-chip>
        <line-chip outline color="danger">
          <line-label>Danger</line-label>
        </line-chip>
      </p>

      <line-list-header>Icons</line-list-header>
      <p>
        <line-chip outline color="primary">
          <line-icon source="/ionic-icons.symbols.svg" name="pin"></line-icon>
          <line-label>Madison</line-label>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="close-circle"
          ></line-icon>
        </line-chip>
        <line-chip outline color="secondary">
          <line-icon source="/ionic-icons.symbols.svg" name="wine"></line-icon>
          <line-label>Nightlife</line-label>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="close-circle"
          ></line-icon>
        </line-chip>
        <line-chip outline color="tertiary">
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="restaurant"
          ></line-icon>
          <line-label>Dining</line-label>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="close-circle"
          ></line-icon>
        </line-chip>
        <line-chip outline color="dark">
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="videocam"
          ></line-icon>
          <line-label>Entertainment</line-label>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="close-circle"
          ></line-icon>
        </line-chip>
      </p>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped></style>
