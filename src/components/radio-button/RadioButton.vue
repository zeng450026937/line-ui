<template>
  <div class="radio-button"
       :class="{'radio-button--checked': checked,
                  'radio-button--disabled': disabled }"
       @click="toggle">
    <span class="radio-button__icon">
      <input type="radio"
             ref="radio"
             :value="value"
             :disabled="disabled"
             @focus="focus = true"
             @blur="focus = false">
    </span>
    <span class="radio-button__label">
      <slot>
      </slot>
    </span>
  </div>
</template>

<script>
import Vue from 'vue';
import AbstractButton from '@/mixins/abstract-button';
import { createGroupItem } from '@/components/group';

export default Vue.extend({
  name: 'RadioButton',

  mixins: [createGroupItem('RadioButtonGroup')],
  extends: AbstractButton,

  props: {
    autoExclusive: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      focus: false,
    };
  },

  computed: {

  },

  methods: {
    toggle() {
      if (this.disabled) {
        return;
      }
      if (!this.checked) {
        this.checked = !this.checked;
      }
    },
  },

  watch: {
    checked(newVal) {
      console.log('checked - ', this.label, newVal);
    },
  },
});
</script>

<style lang="scss">
.radio-button {
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    outline: none;
    position: absolute;
    user-select: none;
    z-index: -1;
  }
  &__icon {
    display: block;
    width: 18px;
    height: 18px;
    background-color: #fff;
    border: 2px solid #dcdfe6;
    border-radius: 100%;
    box-sizing: border-box;
    position: relative;

    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 100%;
      background-color: #10c29b;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      transform: scale(0, 0);
    }
  }
  &__label {
    color: #666;
    margin-left: 8px;
  }
}
.radio-button--checked {
  .radio-button__icon {
    border-color: #10c29b;

    &::after {
      transform: scale(1, 1);
      transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

.radio-button--disabled {
  cursor: not-allowed;
  .radio-button__icon {
    border-color: rgba($color: #000000, $alpha: 0.2) !important;
    &::after {
      background-color: rgba($color: #000000, $alpha: 0.3) !important;
    }
  }
  .radio-button__label {
    color: rgba($color: #000000, $alpha: 0.4);
  }
}

.radio-button + .radio-button {
  margin-left: 8px;
}
</style>
