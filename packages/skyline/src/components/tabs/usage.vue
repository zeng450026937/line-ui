<template>
  <line-content>
    <line-tabs v-model="value">
      <line-tab modelValue="1">
        <div class="content">
          <line-icon
            name="class"
            size="large"
          ></line-icon>
          Class
        </div>
      </line-tab>
      <line-tab modelValue="2">
        <div class="content">
          <line-icon
            name="account_box"
            size="large"
          ></line-icon>
          Account
        </div>
      </line-tab>
      <line-tab modelValue="3">
        <div class="content">
          <line-icon
            name="dashboard"
            size="large"
          ></line-icon>
          Dashboard
        </div>
      </line-tab>
      <line-tab-bar
        v-model="value"
        slot="bottom"
      >
        <line-tab-button modelValue="1">
          <line-icon name="class"></line-icon>
          Class
        </line-tab-button>
        <line-tab-button modelValue="2">
          <line-icon name="account_box"></line-icon>
          Account
        </line-tab-button>
        <line-tab-button modelValue="3">
          <line-icon name="dashboard"></line-icon>
          Dashboard
        </line-tab-button>
      </line-tab-bar>
    </line-tabs>
  </line-content>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value : '1',
    };
  },

  methods : {
    toggled(value) {
      this.value = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}
</style>
