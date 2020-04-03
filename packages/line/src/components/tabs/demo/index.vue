<template>
  <div class="tabs-demo">
    <line-tabs v-model="value">
      <line-tab modelValue="1">1</line-tab>
      <line-tab modelValue="2">2</line-tab>
      <line-tab modelValue="3">3</line-tab>
      <line-tab-bar v-model="value" slot="bottom">
        <line-tab-button modelValue="1">
          <line-icon name="backup"></line-icon>
          button - 1
        </line-tab-button>
        <line-tab-button modelValue="2">
          <line-icon name="android"></line-icon>
          button - 2
        </line-tab-button>
        <line-tab-button modelValue="3">
          <line-icon name="alarm"></line-icon>
          button - 3
        </line-tab-button>
      </line-tab-bar>
    </line-tabs>
  </div>
</template>

<script>
import {
  Tab as LineTab,
  Tabs as LineTabs,
} from '@line-ui/skyline/components/tabs';
import { TabBar as LineTabBar } from '@line-ui/skyline/components/tab-bar';
import { TabButton as LineTabButton } from '@line-ui/skyline/components/tab-button';
import { Icon as LineIcon } from '@line-ui/skyline/components/icon';

export default {
  name: 'TabsDemo',

  components: {
    LineTabs,
    LineTab,
    LineTabBar,
    LineTabButton,
    LineIcon,
  },

  props: {},

  data() {
    return {
      value: '1',
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {},

  watch: {},
};
</script>

<style lang="scss" scoped>
.tabs-demo {
  position: relative;

  width: 100%;
  height: 100%;
}
</style>
