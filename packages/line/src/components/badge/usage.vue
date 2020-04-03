<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Badge</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-list>
        <line-list-header>Bdages</line-list-header>
        <line-item>
          <line-label>Followers</line-label>
          <line-badge>22k</line-badge>
        </line-item>
        <line-item>
          <line-label>Likes</line-label>
          <line-badge color="secondary">22k</line-badge>
        </line-item>
        <line-item>
          <line-label>Stars</line-label>
          <line-badge color="tertiary">34k</line-badge>
        </line-item>
        <line-item>
          <line-label>Completed</line-label>
          <line-badge color="success">22</line-badge>
        </line-item>
        <line-item>
          <line-label>Warnings</line-label>
          <line-badge color="warning">8</line-badge>
        </line-item>
        <line-item>
          <line-label>Notifications</line-label>
          <line-badge color="danger">10000</line-badge>
        </line-item>
        <line-item>
          <line-label>Unread</line-label>
          <line-badge color="light">10</line-badge>
        </line-item>
        <line-item>
          <line-label>Drafts</line-label>
          <line-badge color="medium">14</line-badge>
        </line-item>
        <line-item>
          <line-label>Deleted</line-label>
          <line-badge color="dark">2</line-badge>
        </line-item>
      </line-list>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped></style>
