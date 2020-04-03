<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Reorder-Group</line-title>
        <template #primary>
          <line-button @click="toggleReorder">Toggle</line-button>
        </template>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-list>
        <line-list-header>Reorder Icon</line-list-header>
        <line-reorder-group
          ref="reorder"
          :disabled="disabled"
          @itemReorder="onItemReorder"
        >
          <line-item>
            <line-label>
              Item 1
            </line-label>
            <template #end>
              <line-reorder></line-reorder>
            </template>
          </line-item>

          <line-item>
            <line-label>
              Item 2
            </line-label>
            <template #end>
              <line-reorder></line-reorder>
            </template>
          </line-item>

          <line-item>
            <line-label>
              Item 3
            </line-label>
            <template #end>
              <line-reorder></line-reorder>
            </template>
          </line-item>

          <line-item>
            <line-label>
              Item 4
            </line-label>
            <template #end>
              <line-reorder></line-reorder>
            </template>
          </line-item>

          <line-list-header>Custom Reorder Icon</line-list-header>
          <line-item>
            <line-label>
              Item 5
            </line-label>
            <template #start>
              <line-reorder>
                <line-icon name="repeat" size="small"></line-icon>
              </line-reorder>
            </template>
          </line-item>

          <line-item>
            <line-label>
              Item 6
            </line-label>
            <template #start>
              <line-reorder>
                <line-icon name="repeat" size="small"></line-icon>
              </line-reorder>
            </template>
          </line-item>

          <line-item>
            <line-label>
              Item 7
            </line-label>
            <template #start>
              <line-reorder>
                <line-icon name="repeat" size="small"></line-icon>
              </line-reorder>
            </template>
          </line-item>

          <line-list-header>Reorder Item</line-list-header>
          <line-reorder>
            <line-item>
              <line-label>
                Item 8
              </line-label>
            </line-item>
          </line-reorder>

          <line-reorder>
            <line-item>
              <line-label>
                Item 9
              </line-label>
            </line-item>
          </line-reorder>

          <line-reorder>
            <line-item>
              <line-label>
                Item 10
              </line-label>
            </line-item>
          </line-reorder>
        </line-reorder-group>
      </line-list>
    </line-content>
  </line-app>
</template>

<script>
export default {
  data() {
    return {
      disabled: true,
    };
  },

  methods: {
    toggleReorder() {
      this.disabled = !this.disabled;
    },

    onItemReorder(detail) {
      detail.complete(true);
    },
  },

  watch: {},
};
</script>

<style lang="scss" scoped>
.usage {
  width: 100%;
  height: 100%;
}
</style>
