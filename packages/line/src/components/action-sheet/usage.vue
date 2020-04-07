<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>ActionSheet</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-action-sheet
        header="ActionSheet"
        sub-header="ActionSheetSubHeader"
        :actions="actions"
        v-model="visible"
      >
        <line-action-group>
          <line-action-sheet-title sub-header="sub-header">
            action-sheet
          </line-action-sheet-title>
          <line-action :option="{ role: 'destructive' }">
            Delete
          </line-action>
          <line-action>
            Share
            <line-icon name="share"></line-icon>
          </line-action>
          <line-action>
            Play
          </line-action>
          <line-action>
            Favorite
          </line-action>
        </line-action-group>
        <line-action-group cancel>
          <line-action :option="{ role: 'cancel' }">
            Cancel
          </line-action>
        </line-action-group>
      </line-action-sheet>
      <line-button expand="block" @click="open">
        Show ActionSheet
      </line-button>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      actions: [],
      visible: false,
    };
  },

  methods: {
    open() {
      this.visible = !this.visible;
    },
  },

  watch: {
    visible(val, oldVal) {
      console.log('visible', val, oldVal);
    },
  },

  mounted() {
    this.actions = [
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          console.log('Delete clicked');
        },
      },
      {
        text: 'Share',
      },
      { text: 'Play' },
      { text: 'Favorite' },
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ];
  },
});
</script>

<<<<<<< Updated upstream
<style lang="scss" scoped></style>
=======
<style lang="scss">
.back-button .line-button__content {
  padding-inline-start: 0;
}
</style>
>>>>>>> Stashed changes
