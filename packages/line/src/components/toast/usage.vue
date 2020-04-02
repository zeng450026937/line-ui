<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Toast</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-toast
        color="dark"
        :duration="2000"
        message="Paired successfully"
        v-model="visible"
      >
      </line-toast>
      <line-button
        expand="block"
        @click="open"
      >
        Pair
        <template #end>
          <line-icon
            source="/ionic-icons.symbols.svg"
            name="bluetooth"
          ></line-icon>
        </template>
      </line-button>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      visible : false,
    };
  },

  methods : {
    open() {
      this.visible = !this.visible;
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
