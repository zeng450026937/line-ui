<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>ActionSheet</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-action-sheet
        header='ActionSheet'
        sub-header="ActionSheetSubHeader"
        :actions='actions'
        v-model="visible"
      >
        <line-action-sheet-group>
          <line-action-sheet-title sub-header="sub-header">
            action-sheet
          </line-action-sheet-title>
          <line-action-sheet-button
            :option="{'role': 'destructive'}"
          >
            Delete
          </line-action-sheet-button>
          <line-action-sheet-button>
            Share
            <line-icon name="share"></line-icon>
          </line-action-sheet-button>
          <line-action-sheet-button>
            Play
          </line-action-sheet-button>
          <line-action-sheet-button>
            Favorite
          </line-action-sheet-button>
        </line-action-sheet-group>
        <line-action-sheet-group cancel>
          <line-action-sheet-button
            :option="{'role': 'cancel'}"
          >
            Cancel
          </line-action-sheet-button>
        </line-action-sheet-group>
      </line-action-sheet>
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

export default Vue.extend({
  data() {
    return {
      actions : [],
      visible : false,
    };
  },

  methods : {
    open() {
      this.visible = !this.visible;
    },
  },

  watch : {
    visible(val, oldVal) {
      console.log('visible', val, oldVal);
    },
  },

  mounted() {
    this.actions = [
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
    ];
  },
});
</script>

<style lang="scss" scoped>
</style>
