import { isObject } from 'skyline/utils/helpers';
import { createNamespace } from 'skyline/utils/namespace';
import { Icon } from 'skyline/components/icon';

const [createComponent, bem] = createNamespace('page-indicator');

export default createComponent({
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
  },

  data() {
    return {
      length : 0,
    };
  },

  computed : {
    list(): (string | number)[] {
      const countVisible = parseInt((this.countVisible as string), 10);

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
  },

  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods : {
    onResize(): void {
      const width = (this.$refs.indicator as Element).clientWidth;

      this.length = Math.floor((width - 100) / 46);
    },

    range(from: number, to: number): number[] {
      const range = [];

      from = from > 0 ? from : 1;
      for (let i = from; i <= to; i++) {
        range.push(i);
      }

      return range;
    },

    onClick(value: string | number): void {
      value = Number.parseInt((value as string), 10);
      if (Number.isNaN(value)) {
        return;
      }

      this.$emit('input', value);
    },

    next(): void {
      let value = this.value + 1;
      if (value > this.count) {
        value = this.count;
      }
      this.$emit('input', value);
      this.$emit('next', value);
    },
    previous(): void {
      let value = this.value - 1;
      if (value < 1) {
        value = 1;
      }
      this.$emit('input', value);
      this.$emit('previous', value);
    },
  },

  render() {
    const { value, list } = this;

    return (
      <ul class={bem()}
          ref="indicator">
        <li class={bem('item')}
            onClick={() => this.previous()}>
          <Icon {...{ props: isObject(this.prevIcon) ? this.prevIcon : { name: this.prevIcon } }}></Icon>
        </li>
        {list.map((item, index) => {
          return (
            <li key={index}
                class={bem('item', { active: value === item })}
                onClick={() => this.onClick(item)}>
              {item}
            </li>);
        })}
        <li class={bem('item')}
            onClick={() => this.next()}>
          <Icon {...{ props: isObject(this.nextIcon) ? this.nextIcon : { name: this.nextIcon } }}></Icon>
        </li>
      </ul>);
  },
});
