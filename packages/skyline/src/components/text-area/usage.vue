<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Textarea</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list
        lines="full"
        class="line-no-margin line-no-padding"
      >
        <line-item>
          <line-label position="stacked">Notes</line-label>
          <line-textarea v-model="value"></line-textarea>
        </line-item>
      </line-list>

      <div class="line-padding">
        <line-button
          expand="block"
          type="submit"
          class="line-no-margin"
        >Create account</line-button>
      </div>
    </line-content>
  </line-app>

</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value : 'line-textarea',
    };
  },

  methods : {

  },
});
</script>

<style lang="scss" scoped>
.line-progress-bar {
  margin: 10px 0;
}
</style>
