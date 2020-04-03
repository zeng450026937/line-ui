<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Dropdown</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-button ref="button" expand="block" @click="open"
        >show Dropdown</line-button
      >
      <line-dropdown
        :trigger="trigger"
        v-model="visible"
        :options="options"
        @optionChange="onChange"
      >
      </line-dropdown>
      <div style="height: 400px;"></div>
      <line-button ref="triggerButton" expand="block" @click="openDropDown"
        >show Dropdown</line-button
      >
      <line-dropdown
        :trigger="triggerButton"
        v-model="buttonVisible"
        @optionChange="onButtonChange"
      >
        <line-dropdown-item :option="{ number: 1 }">
          <line-icon name="settings_voice"></line-icon>
          Voice
        </line-dropdown-item>
        <line-dropdown-item :option="{ number: 2 }">
          <line-icon name="date_range"></line-icon>
          DateRange
        </line-dropdown-item>
        <line-dropdown-item :option="{ number: 3 }">
          <line-icon name="map"></line-icon>
          Map
        </line-dropdown-item>
        <line-dropdown-item :option="{ number: 4 }">
          <line-icon name="theaters"></line-icon>
          Theaters
        </line-dropdown-item>
        <line-dropdown-item :option="{ number: 5 }">
          <line-icon name="redeem"></line-icon>
          Redeem
        </line-dropdown-item>
      </line-dropdown>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      visible: false,
      trigger: null,

      buttonVisible: false,
      triggerButton: null,

      options: [],

      test: 'test',
    };
  },
  methods: {
    open() {
      this.visible = !this.visible;
    },

    openDropDown() {
      this.buttonVisible = !this.buttonVisible;
    },

    onChange(option) {
      console.log('option', option);
    },

    onButtonChange(option) {
      console.log('option', option);
    },
  },

  watch: {
    test(val, oldVal) {
      console.log(val, oldVal);
    },

    visible(val) {
      console.log('visible: ', val);
    },
  },

  mounted() {
    this.trigger = this.$refs.button;
    this.triggerButton = this.$refs.triggerButton;

    this.options = [
      {
        text: '下拉菜单1...长度比较长一些',
        handler: () => {
          this.test = '下拉菜单1';
        },
      },
      {
        text: '下拉菜单2',
        handler: () => {
          this.test = '下拉菜单2';
        },
      },
      {
        text: '下拉菜单3',
        handler: () => {
          this.test = '下拉菜单3';
        },
      },
      {
        text: '下拉菜单4',
        handler: () => {
          this.test = '下拉菜单4';
        },
      },
      {
        text: '下拉菜单5',
        handler: () => {
          this.test = '下拉菜单5';
        },
      },
      {
        text: '下拉菜单6',
        handler: () => {
          this.test = '下拉菜单6';
        },
      },
      { text: '下拉菜单7' },
    ];
  },
});
</script>

<style lang="scss" scoped>
.line-dropdown-item__inner .line-icon {
  margin-right: 10px;
}
</style>
