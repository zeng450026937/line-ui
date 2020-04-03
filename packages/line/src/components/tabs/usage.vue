<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Tabs</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-tabs v-model="value">
        <line-tab modelValue="1">
          <div class="content">
            <line-icon name="class" size="large"></line-icon>
            Class
          </div>
        </line-tab>
        <line-tab modelValue="2">
          <div class="content">
            <line-icon name="account_box" size="large"></line-icon>
            Account
          </div>
        </line-tab>
        <line-tab modelValue="3">
          <div class="content">
            <line-icon name="dashboard" size="large"></line-icon>
            Dashboard
          </div>
        </line-tab>
        <template #bottom>
          <line-tab-bar v-model="value">
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
        </template>
      </line-tabs>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value: '1',
    };
  },

  methods: {
    toggled(value) {
      this.value = value;
    },
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;

  flex-direction: column;
  align-items: center;

  padding: 20px;
}
</style>
