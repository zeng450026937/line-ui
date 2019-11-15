<template>
  <div :class="bem({'arrow': arrow})">
    <div :class="bem('title')">
      <slot name="title">
        {{title}}
      </slot>
    </div>
    <div :class="bem('content')">
      <slot name="content">
        {{content}}
      </slot>
      <span :class="bem('arrow')"
            v-if="arrow">
        <icon name="chevron_right"
              width="24"
              height="24"></icon>
      </span>
    </div>
  </div>
</template>

<script>
import { Icon } from '../icon';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('cell');

export default {
  name : 'Cell',

  components : {
    Icon,
  },

  props : {
    title : {
      type    : [String, Number],
      default : '',
    },
    content : {
      type    : [String, Number],
      default : '',
    },
    arrow : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    bem() {
      return bem;
    },
  },

  methods : {

  },
};
</script>

<style lang="scss" scoped>
.line-cell {
  width: 100%;
  min-height: 50px;
  font-size: 14px;
  line-height: 1;
  background-color: #fff;
  padding: 10px 16px;
  margin: -1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &::after,
  &::before {
    content: '';
    display: block;
    background-color: #ebebeb;
    position: absolute;
    left: 0;
    transform: scaleY(0.5);
  }
  &::after {
    width: 100%;
    height: 1px;
    bottom: 0;
  }
  &::before {
    top: 0;
    height: 1px;
    width: 100%;
  }
  &.line-cell--arrow {
    padding-right: 30px;
  }

  &__title {
    line-height: 1;
    color: #1a1a1a;
  }
  &__content {
    line-height: 1;
    color: #999999;
  }
  &__arrow {
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    right: 3px;
    top: 0;
    user-select: none;
  }
}
</style>
