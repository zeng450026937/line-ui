<template>
  <line-content>
    <line-list>
      <line-list-header>
        <line-label>Default</line-label>
      </line-list-header>

      <line-progress-bar></line-progress-bar>

      <line-list-header>
        <line-label>Default at 50%</line-label>
      </line-list-header>

      <line-progress-bar :value="0.5"></line-progress-bar>

      <line-list-header>
        <line-label>Color</line-label>
      </line-list-header>

      <!-- Progress Bar with Color -->
      <line-progress-bar
        color="secondary"
        :value="0.5"
      ></line-progress-bar>
      <line-progress-bar
        color="tertiary"
        :value="0.8"
      ></line-progress-bar>

      <line-list-header>
        <line-label>
          Indeterminate
        </line-label>
      </line-list-header>
      <line-progress-bar type="indeterminate"></line-progress-bar>

      <line-list-header>
        <line-label>
          Indeterminate (reversed)
        </line-label>
      </line-list-header>
      <line-progress-bar
        type="indeterminate"
        :reversed="true"
      ></line-progress-bar>

      <line-list-header>
        <line-label>
          Buffer
        </line-label>
      </line-list-header>
      <line-progress-bar
        :value="0.25"
        :buffer="0.5"
      ></line-progress-bar>
    </line-list>
  </line-content>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value : 0,
    };
  },

  methods : {

  },

  mounted() {
    setInterval(() => {
      this.value = this.value >= 1 ? 0 : this.value + 0.1;
    }, 1000);
  },

});
</script>

<style lang="scss" scoped>
.line-progress-bar {
  margin: 10px 0;
}
</style>
