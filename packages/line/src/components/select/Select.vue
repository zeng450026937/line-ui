<template>
  <div class="select">
    <div class="select__input" @click="setVisible(true)">
      <span class="input__label">
        {{ label }}
      </span>
      <span class="input__value">
        {{ modelValue }}
      </span>
      <span class="input__icon">
        <font-icon name="expand_more"></font-icon>
      </span>
    </div>

    <popup v-model="visible" global modal dim tappable @tap="setVisible(false)">
      <div class="select__menu">
        <slot name="default"></slot>
        <div class="menu__button" @click="setVisible(false)">
          取消
        </div>
      </div>
    </popup>
  </div>
</template>

<script lang="js">
import Vue from 'vue';
import { Popup } from '@line-ui/skyline/src/components/popup';
import { useGroup } from '@line-ui/skyline/src/components/group';
import { FontIcon } from '@line-ui/skyline/src/components/icon';

const NAMESPACE = 'Select';

export default Vue.extend({
  name : 'Select',

  mixins : [useGroup(NAMESPACE)],

  components : {
    FontIcon,
    Popup,
  },

  props : {
    exclusive : {
      type    : Boolean,
      default : true,
    },
    label : {
      type    : String,
      default : 'select',
    },
  },

  data() {
    return {
      visible : false,
    };
  },

  computed : {},

  methods : {
    hide() {
      this.visible = false;
    },

    setVisible(value) {
      this.visible = value;
      this.$emit('visible-change', value);
    },
  },

  watch : {
    checkedItem(newVal) {
      this.hide();
      this.$emit('change', newVal);
    },
  },
});
</script>

<style lang="scss">
.select {
  width: 100%;
  &__input {
    display: flex;
    position: relative;

    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 36px;

    padding-right: 30px;

    border-bottom: 1px solid var(--light);

    color: #666;

    cursor: pointer;

    .input__label {
      margin-right: 16px;
    }
    .input__value {
      color: #1a1a1a;
    }
    .input__icon {
      position: absolute;
      right: 0;
    }
  }

  &__menu {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;

    flex-direction: column;
    align-items: center;
    justify-content: flex-end;

    width: 100%;
    min-height: 36px;
    max-height: 600px;

    border-radius: 4px;

    background-color: rgb(226, 226, 226);
    overflow-y: auto;

    .menu__button {
      display: flex;

      flex-shrink: 0;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 44px;

      margin-top: 4px;

      background-color: #fff;
      color: #666;

      cursor: pointer;
      &:hover {
        background-color: rgba($color: #ffffff, $alpha: 0.04);
      }
    }
  }
}
</style>
