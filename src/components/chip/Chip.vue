<template>
  <div class="chip"
       :class="classes">
    <span class="chip__content">
      <slot name="default"></slot>
    </span>
    <span class="chip__close"
          v-show="closeIcon"
          @click="onClick">
      <font-icon :name="closeIcon"
                 :height="18">
      </font-icon>
    </span>
  </div>
</template>

<script>
import Vue from 'vue';
import { FontIcon } from '../icon';

const colors = ['primary', 'success', 'warning', 'danger', 'light', 'dark'];

export default Vue.extend({
  name: 'Chip',

  components: {
    FontIcon,
  },

  props: {
    color: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    closeIcon: {
      type: String,
      default: '',
    },
  },

  computed: {
    classes() {
      const { border, color } = this;
      const classes = { 'chip--border': border };

      if (colors.includes(color)) {
        classes[`is-${ color }`] = true;
      }
      return classes;
    },
  },

  watch: {

  },

  created() {

  },

  methods: {
    onClick() {
      this.$emit('close');
    },
  },
});
</script>

<style lang="scss">
.chip {
  height: 32px;
  font-size: 14px;
  color: #1a1a1a;
  background-color: rgba($color: #1a1a1a, $alpha: 0.1);
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  margin: 8px;
  padding: 0 12px;
  position: relative;
  cursor: pointer;
  &__content {
    display: inline-flex;
    align-items: center;
  }
  &__close {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    &:hover {
      opacity: 0.6;
    }
  }
  &.chip--border {
    border: 1px solid #1a1a1a;
  }

  &.chip--border.is-primary {
    border: 1px solid var(--primary);
    background-color: var(--primary-light);
    color: var(--primary);
  }
  &.chip--border.is-success {
    border: 1px solid var(--success);
    background-color: var(--success-light);
    color: var(--success);
  }
  &.chip--border.is-warning {
    border: 1px solid var(--warning);
    background-color: var(--warning-light);
    color: var(--warning);
  }
  &.chip--border.is-danger {
    border: 1px solid var(--danger);
    background-color: var(--danger-light);
    color: var(--danger);
  }
  &.chip--border.is-light {
    border: 1px solid var(--light);
    background-color: var(--light-light);
  }
  &.chip--border.is-dark {
    border: 1px solid var(--dark);
    background-color: var(--dark-light);
    color: var(--dark);
  }

  &.is-primary {
    background-color: var(--primary);
    color: #ffffff;
  }
  &.is-success {
    background-color: var(--success);
    color: #ffffff;
  }
  &.is-warning {
    background-color: var(--warning);
    color: #ffffff;
  }
  &.is-danger {
    background-color: var(--danger);
    color: #ffffff;
  }
  &.is-light {
    background-color: var(--light);
    color: #1a1a1a;
  }
  &.is-dark {
    background-color: var(--dark);
    color: #ffffff;
  }
}
</style>
