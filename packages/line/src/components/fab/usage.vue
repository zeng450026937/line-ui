<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Fab</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <template #fixed>
        <line-fab horizontal="end" vertical="top" edge>
          <template #indicator>
            <line-fab-button>
              <line-icon name="add"></line-icon>
            </line-fab-button>
          </template>
          <line-fab-button slot="bottom" color="light" :key="1">
            <line-icon name="book"></line-icon>
          </line-fab-button>
          <line-fab-button slot="bottom" color="light" :key="2">
            <line-icon name="hourglass_empty"></line-icon>
          </line-fab-button>
          <line-fab-button slot="bottom" color="light" :key="3">
            <line-icon name="language"></line-icon>
          </line-fab-button>
        </line-fab>
      </template>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  methods: {},
});
</script>

<style lang="scss" scoped></style>
