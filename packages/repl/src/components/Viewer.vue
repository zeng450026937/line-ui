<template>
  <div class="viewer">
    <line-spinner type="dots" v-show="loading || !resource"></line-spinner>

    <template v-if="resource">
      <line-tabs :value="tab" v-show="!loading">
        <line-tab model-value="readme">
          <Readme :html="readme"></Readme>
        </line-tab>
        <line-tab model-value="usage">
          <line-lazy :value="tab === 'usage'">
            <Repl :value="source"></Repl>
          </line-lazy>
        </line-tab>

        <template #top>
          <line-tab-bar
            v-model="select"
            translucent
            style="text-transform: capitalize;"
          >
            <line-tab-button model-value="readme">
              Readme
            </line-tab-button>
            <template v-for="(key, index) in resource.usage.keys">
              <line-tab-button :key="index" :model-value="key">
                {{ key === 'index' ? 'Usage' : key }}
              </line-tab-button>
            </template>
          </line-tab-bar>
        </template>
      </line-tabs>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Repl from './Repl/Repl.vue';
import Readme from './Readme.vue';

export default Vue.extend({
  components: { Repl, Readme },

  store: {
    state: ['resources'],
  },

  data() {
    return {
      loading: false,

      readme: '',
      source: '',

      select: 'readme',
    };
  },

  computed: {
    component() {
      return this.$route.params.component;
    },
    usage() {
      return this.$route.params.usage || 'index';
    },
    resource() {
      return this.resources.find((res) => res.name === this.component);
    },

    tab() {
      return this.select === 'readme' ? this.select : 'usage';
    },
  },

  watch: {
    resource: 'load',
  },

  mounted() {
    this.load();
  },

  methods: {
    async load() {
      if (!this.resource) return;

      this.loading = true;

      this.readme = '';
      if (this.component) {
        this.readme = await this.resource.readme.load().catch(() => '');
      }

      this.source = '';
      if (this.usage) {
        this.source = await this.resource.usage
          .load(this.usage)
          .catch(() => '');
      }

      this.loading = false;
    },
  },
});
</script>

<style lang="scss">
.viewer {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: auto;

  .line-spinner {
    top: 50%;
    left: 50%;

    width: 36px;
    height: 36px;

    transform: translate(-50%, -50%);
  }
}
</style>
