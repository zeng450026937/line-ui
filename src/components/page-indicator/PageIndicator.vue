<template>
  <ul :class="bem()"
      ref="indicator">
    <li :class="bem('item')"
        @click="previous">
      <icon v-bind="isObject(prevIcon) ? prevIcon : {name: prevIcon}"></icon>
    </li>
    <li v-for="(item, index) in list"
        :key="index"
        :class="bem('item', { 'active': value === item })"
        @click="onClick(item)">
      {{ item }}
    </li>
    <li :class="bem('item')"
        @click="next">
      <icon v-bind="isObject(nextIcon) ? nextIcon : {name: nextIcon}"></icon>
    </li>
  </ul>
</template>

<script>
import { Icon } from '../icon';
import { isObject } from '@/utils/helpers';
import { createNamespace } from '@/utils/namespace';

const [createComponent, bem, t] = createNamespace('page-indicator');

export default {
  name : 'PageIndicator',

  components : {
    Icon,
  },

  props : {
    count : {
      type      : Number,
      default   : 0,
      validator : val => val % 1 === 0,
    },
    value : {
      type    : Number,
      default : 1,
    },
    delegate : {
      type    : Object,
      default : () => ({}),
    },
    interactive : {
      type    : Boolean,
      default : true,
    },

    nextIcon : {
      type    : [String, Object],
      default : 'chevron_right',
    },
    prevIcon : {
      type    : [String, Object],
      default : 'chevron_left',
    },
    countVisible : {
      type    : [Number, String],
      default : 6,
    },

    props : {
      type    : Object,
      default : () => { },
    },
  },

  data() {
    return {
      length : 0,
    };
  },

  computed : {
    list() {
      const countVisible = parseInt(this.countVisible, 10);

      const maxLength = Math.min(
        Math.max(0, countVisible) || this.count,
        Math.max(0, this.length) || this.count,
        this.count,
      );

      if (this.count <= maxLength) {
        return this.range(1, this.count);
      }

      const even = maxLength % 2 === 0 ? 1 : 0;
      const left = Math.floor(maxLength / 2);
      const right = this.count - left + 1 + even;

      if (this.value > left && this.value < right) {
        const start = this.value - left + 2;
        const end = this.value + left - 2 - even;

        return [1, '...', ...this.range(start, end), '...', this.count];
      } if (this.value === left) {
        const end = this.value + left - 1 - even;
        return [...this.range(1, end), '...', this.count];
      } if (this.value === right) {
        const start = this.value - left + 1;
        return [1, '...', ...this.range(start, this.count)];
      }
      return [
        ...this.range(1, left),
        '...',
        ...this.range(right, this.count),
      ];
    },

    bem() {
      return bem;
    },

    isObject() {
      return isObject;
    },
  },

  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods : {
    onResize() {
      const width = this.$refs.indicator.clientWidth;

      this.length = Math.floor((width - 100) / 46);
    },

    range(from, to) {
      const range = [];

      from = from > 0 ? from : 1;

      for (let i = from; i <= to; i++) {
        range.push(i);
      }

      return range;
    },

    onClick(value) {
      value = Number.parseInt(value, 10);
      if (Number.isNaN(value)) {
        return;
      }
      this.$emit('input', value);
    },

    next() {
      let value = this.value + 1;
      if (value > this.count) {
        value = this.count;
      }
      this.$emit('input', value);
      this.$emit('next', value);
    },
    previous() {
      let value = this.value - 1;
      if (value < 1) {
        value = 1;
      }
      this.$emit('input', value);
      this.$emit('previous', value);
    },
  },
};
</script>

<style lang="scss">
.line-page-indicator {
  width: 100%;
  height: 28px;
  display: flex;
  justify-content: center;

  &__item {
    min-width: 36px;
    height: 36px;
    color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  &__item--active {
    background-color: var(--primary);
    color: #ffffff;
  }
  &__item--disabled {
    color: #9f9f9f;
    cursor: not-allowed;
  }
  &__item:nth-of-type(1),
  &__item:nth-last-of-type(1) {
    user-select: none;
  }
}
</style>
