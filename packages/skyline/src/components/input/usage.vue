<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Input</line-title>
      </line-toolbar>
    </line-header>
    <line-content>
      <line-list
        lines="full"
        class="line-no-margin line-no-padding"
      >
        <line-item>
          <line-label position="stacked">First Name
          </line-label>
          <line-input
            required
            type="text"
            clearInput
            v-model="firstName"
          ></line-input>
        </line-item>

        <line-item>
          <line-label position="stacked">Last Name
          </line-label>
          <line-input
            required
            type="text"
            v-model="lastName"
          ></line-input>
        </line-item>

        <line-item>
          <line-label position="floating">Title</line-label>
          <line-input></line-input>
        </line-item>

        <line-item>
          <line-label position="stacked">Address</line-label>
          <line-input placeholder="Address Line 1"></line-input>
          <line-input placeholder="Address Line 2"></line-input>
          <line-input placeholder="City"></line-input>
          <line-input placeholder="State"></line-input>
          <line-input placeholder="Zip Code"></line-input>
        </line-item>

        <line-item>
          <line-label position="stacked">Notes</line-label>
          <line-textarea></line-textarea>
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
      value     : 'input',
      firstName : '',
      lastName  : '',
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
