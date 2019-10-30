<template>
  <div class="check-box"
       :class="{'check-box--checked': isChecked,
                'check-box--disabled': isDisabled}"
       @click="setCheckState">
    <span class="check-box__icon">
      <svg class="checkbox-icon"
           viewBox="0 0 24 24">
        <path d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
      </svg>
    </span>
    <label class="check-box__label">
      <slot>
      </slot>
    </label>
  </div>
</template>

<script>
import Vue from 'vue';
import AbstractButton from '@/mixins/abstract-button';

export const CheckState = {
  Unchecked: 1,
  PartiallyChecked: 2,
  Checked: 3,
};

export default Vue.extend({
  name: 'CheckBox',

  extends: AbstractButton,

  model: {
    prop: 'checkState',
    event: 'change',
  },

  props: {
    checkState: {
      type: Number,
      default: CheckState.Unchecked,
    },
    nextCheckState: {
      type: Function,
      default() {
        return this.checkState === Checked ? Unchecked : Checked;
      },
    },
    tristate: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isUnchecked() {
      return this.checkState === 1;
    },

    isPartiallyChecked() {
      return this.checkState === 2;
    },

    isChecked() {
      return this.checkState === 3;
    },

    isDisabled() {
      return this.disabled;
    },
  },

  methods: {
    setCheckState() {
      if (this.isDisabled) {
        return;
      }
      this.$emit('change', this.checkState === 1 ? 3 : 1);
    },
  },
});
</script>

<style lang="scss">
.check-box {
  margin: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  &__icon {
    display: block;
    width: 18px;
    height: 18px;
    // cursor: pointer;
    svg {
      width: 100%;
      height: 100%;
      display: block;
      box-sizing: border-box;
      position: relative;
      background-color: transparent;
      border-radius: 2px;
      border: 1px solid #1a1a1a;
      path {
        fill: none;
        stroke: #ffffff;
        stroke-width: 4;
        transform-origin: center;
        transform: scale(0, 0);
      }
    }
  }
  &__label {
    color: #666;
    margin-left: 8px;
    // cursor: pointer;
  }
}
.check-box--checked {
  .check-box__icon {
    svg {
      background-color: #10c29b;
      border-color: #10c29b;
      path {
        transition: transform 90ms linear 80ms;
        transition-timing-function: cubic-bezier(0.4, 0, 1, 1),
          cubic-bezier(0.18, 0.89, 0.32, 1.28);
        transform: scale(0.8, 0.8);
      }
    }
  }
  .check-box__label {
    color: #10c29b;
    margin-left: 8px;
  }
}
.check-box--disabled {
  .check-box__icon {
    cursor: not-allowed;
    svg {
      background-color: rgba($color: #000000, $alpha: 0.15) !important;
      border-color: rgba($color: #000000, $alpha: 0.2) !important;
    }
  }
  .check-box__label {
    color: rgba($color: #000000, $alpha: 0.4);
  }
}

.check-box + .check-box {
  margin-left: 8px;
}
</style>
