<template>
  <div class="menu-wrapper">
    <line-list>
      <template v-for="res in resources">
        <line-item
          :key="res.name"
          button
          lines="none"
          :detail="false"
          :class="{ 'has-focus': res.name === component }"
          @click="go(`/${res.name}`)"
        >
          <template #start>
            <div class="item-indicator"></div>
          </template>
          <line-label>{{ res.name.replace(/-/g, ' ') }}</line-label>
        </line-item>
      </template>
    </line-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  store: {
    state: ['resources'],
  },

  computed: {
    component() {
      return this.$route.params.component;
    },
    usage() {
      return this.$route.params.usage;
    },
  },

  methods: {
    go(to) {
      this.$router.push(to).catch(() => {});
    },
  },
});
</script>

<style lang="scss">
.menu-wrapper {
  position: relative;

  width: 304px;
  height: 100%;

  background-color: rgba(#e6e6e6, 0.5);
  backdrop-filter: saturate(180%) blur(20px);

  overflow-y: auto;

  .line-list {
    --line-item-background: transparent;
  }

  .line-item {
    --min-height: 50px;
    --padding-start: 28px;
    --background-hover: rgba(212, 212, 212, 0.5);
    --background-activated: rgba(212, 212, 212, 1);

    font-size: 1em;

    text-transform: capitalize;

    cursor: pointer;

    .item-detail-icon {
      /* prettier-ignore */
      font-family: "MaterialIcons-Icons";
      font-style: normal;

      text-transform: none;
    }

    .item-indicator {
      position: absolute;

      left: 0;

      width: 4px;
      height: 1.5em;

      transition: opacity 200ms ease;

      background: #0078d7;

      opacity: 0;
    }
  }
  .line-item.has-focus {
    --background: rgba(212, 212, 212, 0.5);

    .item-indicator {
      opacity: 1;
    }
  }
}
</style>
