<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Dropdown</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-button
        ref="button"
        expand="block"
        @click="open"
        style="width: 200px;

 margin-top: 200px; margin-left: 100px;"
      >
        show Combo Box
      </line-button>

      <line-combo-box v-model="visible" trigger="button" expand>
        <line-combo-box-item> combo-box-item - 1 </line-combo-box-item>
        <line-combo-box-item> combo-box-item - 1 </line-combo-box-item>
        <line-combo-box-item> combo-box-item - 1 </line-combo-box-item>
        <line-combo-box-item> combo-box-item - 1 </line-combo-box-item>
        <line-combo-box-item> combo-box-item - 1 </line-combo-box-item>
        <!-- <line-combo-box-item> combo-box-item - 1 </line-combo-box-item> -->
        <!-- <line-combo-box-item> combo-box-item - 1 </line-combo-box-item> -->
      </line-combo-box>
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
      console.log('open:', this.visible);
    },

    openDropDown() {
      this.buttonVisible = !this.buttonVisible;
    },

    onChange(option) {
      console.log('option: ', option);
    },

    onButtonChange(option) {
      console.log('option: ', option);
    },

    onGoBack() {
      this.$router.back();
    },
  },

  watch: {
    test(val, oldVal) {
      console.log('test: ', val, oldVal);
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
