<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>ActionSheet</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-button
        expand="block"
        @click="open"
      >
        Show ActionSheet
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';
import { ActionSheetController } from 'skyline/controller/action-sheet';

const controller = new ActionSheetController();

export default Vue.extend({
  data() {
    return {
      actions : [],
    };
  },
  methods : {
    open() {
      controller.create({
        header  : 'ActionSheet',
        actions : [
          {
            text    : 'Delete',
            role    : 'destructive',
            handler : () => {
              console.log('Delete clicked');
            },
          },
          {
            text : 'Share',
          },
          { text: 'Play' },
          { text: 'Favorite' },
          {
            text : 'Cancel',
            role : 'cancel',
          },
        ],
      }).open();
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
