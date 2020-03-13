<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>List</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>
          Recent Conversatlines
        </line-list-header>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-finn.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Finn</h2>
            <h3>I'm a big deal</h3>
            <p>Listen, I've had a pretty messed up day...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-han.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Han</h2>
            <h3>Look, kid...</h3>
            <p>I've got enough on my plate as it is, and I...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-rey.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Rey</h2>
            <h3>I can handle myself</h3>
            <p>You will remove these restraints and leave...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-luke.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Luke</h2>
            <h3>Your thoughts betray you</h3>
            <p>I feel the good in you, the conflict...</p>
          </line-label>
        </line-item>
      </line-list>

      <line-list>
        <line-list-header>
          Online
        </line-list-header>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-poe.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Poe</h2>
            <h3>New Ride</h3>
            <p>I just upgraded my X-Wing. Next time...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-ben.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Ben</h2>
            <h3>Move Along</h3>
            <p>These aren't the droids you're looking for...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-leia.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Leia</h2>
            <h3>You're My Only Hope</h3>
            <p>I've placed informatline vital to the survival...</p>
          </line-label>
        </line-item>

        <line-item>
          <template #start>
            <line-avatar>
              <img src="/avatar-yoda.png">
            </line-avatar>
          </template>
          <line-label>
            <h2>Yoda</h2>
            <h3>Size matters not</h3>
            <p>Do or do not. There is no try...</p>
          </line-label>
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
</style>
