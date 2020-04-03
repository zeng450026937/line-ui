<template>
  <div class="mobile-navigation">
    <line-collapse v-model="value" :exclusive="false">
      <line-collapse-item
        v-for="(item, index) in list"
        :key="index"
        :modelValue="item.value"
      >
        <template slot="title">
          {{ item['label-cn'] }}
          <!-- {{ item.label }} -->
        </template>
        <template slot="icon">
          <line-icon :name="item.icon" width="24"></line-icon>
        </template>
        <template>
          <div v-for="(child, index) in item.children" :key="index">
            <line-cell
              :title="child.label"
              arrow
              @click="onRouter(child.value)"
            >
            </line-cell>
          </div>
        </template>
      </line-collapse-item>
    </line-collapse>
  </div>
</template>

<script>
import { Cell as LineCell } from '@/components/cell';
import { Icon as LineIcon } from '@/components/icon';
import {
  Collapse as LineCollapse,
  CollapseItem as LineCollapseItem,
} from '@/components/collapse';

export default {
  name: 'MobileNavigation',

  components: {
    LineCell,
    LineIcon,
    LineCollapse,
    LineCollapseItem,
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      value: [],
    };
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    onRouter(name) {
      this.$router.push({ name: `demo-${name}` });
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
// .mobile-navigation {
// padding: 0 20px;

// border: 1px solid #ebebee;
// }
</style>
