<template>
  <div class="action-sheet-usage">
    <line-button
      expand="block"
      @click="open"
    >
      Show ActionSheet
    </line-button>
  </div>
</template>

<script>
import Vue from 'vue';
import { ActionSheetController } from '@/controller/action-sheet';

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
.action-sheet-usage {
  width: 100%;
  height: 100%;

  padding: 16px;
}
</style>
