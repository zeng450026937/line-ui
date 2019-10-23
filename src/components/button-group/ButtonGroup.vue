<template>
  <div class="button-group">
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',

  props: {
    buttons: {
      type: Array,
      default: () => ([]),
    },
    checkState: {
      type: Array,
      default: null,
    },
    checkedButton: {
      type: Object,
      default: null,
    },
    exclusive: {
      type: Boolean,
      default: true,
    },
  },

  provide() {
    const vm = this;
    return {
      get ButtonGroup() {
        return vm;
      },
    };
  },

  methods: {
    addButton(button) {
      this.children.add(button);
    },

    removeButton(button) {
      this.children.delete(button);
    },

    buttonClicked(button) {
      this.$emit('clicked', button);
      
      if (button.checked) {
        this.checkedButton = button;
      } else if (this.checkedButton === button) {
        this.checkedButton = null;
      }

      if (this.exclusive) {
        this.children.forEach((btn) => {
          if (btn === button) return;
          btn.checked = false;
        });
      }
    },
  },

  created() {
    this.$emit('clicked');
    this.children = new Set();
  },
};
</script>

<style lang="scss">

</style>
