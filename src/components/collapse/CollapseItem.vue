<template>
  <div class="collapse-item"
       :class="{'collapse-item--active': checked}">
    <div class="collapse-item__title"
         :class="{'is-disabled': disabled}"
         @click="onClick">
      <slot name="title">{{ title }}</slot>
      <font-icon class="collapse-item__title-icon"
                 :class="{'is-rotate': checked}"
                 name="expand_more"
                 :height="18">
      </font-icon>
      <!-- <span>
        <slot name="icon">
        </slot>
      </span> -->
    </div>
    <div class="collapse-item__content"
         v-show="checked">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import { FontIcon } from '../icon';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'Collapse';

export default {
  name: 'CollapseItem',

  mixins: [useGroupItem(NAMESPACE)],

  components: {
    FontIcon,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    iconName() {
      return this.checked ? 'expand_less' : 'expand_more';
    },
  },

  methods: {
    onClick() {
      if (this.checkable && !this.disabled) {
        this.checked = !this.checked;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.collapse-item {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #ebebeb;
  transition: all 0.3s;

  &__title {
    width: 100%;
    height: 48px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1a1a1a;
    cursor: pointer;
    &.is-disabled {
      color: #999999;
      cursor: not-allowed;
      .collapse-item__title-icon {
        color: #9f9f9f;
      }
    }
    &-icon {
      color: #666666;
      transition: transform 0.3s;
      user-select: none;

      &.is-rotate {
        transform: rotate(-180deg);
      }
    }
  }

  &__content {
    width: 100%;
    padding: 24px 12px;
  }
}
</style>
