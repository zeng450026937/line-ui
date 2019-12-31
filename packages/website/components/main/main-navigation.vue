<template>
  <div class="main-navigation">
    <template v-for="(item, index) in list">
      <div class="main-navigation__item is--sub-title"
           :key="index">
        {{ item.label }}
      </div>
      <div class="main-navigation__item is--link"
           v-for="(child) in item.children"
           :key="child.value"
           :class="{'is--active': child.value === currentName,}"
           @click="routerView(child.value)">
        {{child.label}} {{child['label-cn']}}
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name : 'MainNavigation',

  components : {

  },

  props : {
    list : {
      type    : Array,
      default : () => [],
    },
  },

  data() {
    return {

    };
  },

  computed : {
    currentName() {
      return this.$route.name;
    },
  },

  created() {

  },

  mounted() {

  },

  methods : {
    routerView(name) {
      if (this.$route.name === name || !name) {
        return;
      }

      this.$router.push({ name });
    },
  },

  watch : {

  },
};
</script>

<style lang="scss" scoped>
.main-navigation {
  display: flex;

  flex-direction: column;

  padding: 0 60px;
  &__item {
    &.is--link {
      margin: 20px 0;

      color: #1a1a1a;

      font-size: 14px;

      cursor: pointer;
      &:hover {
        color: #10c29bab;
      }
      &:active {
        color: #10c29b;
      }
    }
    &.is--title {
      margin: 20px 0;

      color: #1a1a1a;

      font-size: 18px;
      font-weight: 600;

      cursor: default;
    }
    &.is--sub-title {
      margin-top: 30px;
      margin-bottom: 16px;

      color: #bfbfbf;

      font-size: 16px;
      font-weight: 600;

      cursor: default;
      user-select: none;
    }
    &.is--active {
      color: #10c29b;
      &:hover {
        color: #10c29b;
      }
      &:active {
        color: #10c29b;
      }
    }
  }
}
</style>
