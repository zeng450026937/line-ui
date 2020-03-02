import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('progress-circular');

export default /*#__PURE__*/ createComponent({
  props : {
    from : {
      type    : Number,
      default : 0,
    },
    to : {
      type    : Number,
      default : 100,
    },
    value : {
      type    : Number,
      default : 0,
    },
    indeterminate : {
      type    : Boolean,
      default : false,
    },
    size : {
      type    : Number,
      default : 32,
    },
    width : {
      type    : [Number, String],
      default : 4,
    },
    rotate : {
      type    : [Number, String],
      default : 0,
    },
    color : {
      type    : String,
      default : '#10c29b',
    },
  },

  computed : {
    position(): number {
      let normalizedValue = this.value;
      const { from, to } = this;

      if (normalizedValue < from) {
        normalizedValue = from;
      }
      if (normalizedValue > to) {
        normalizedValue = to;
      }
      if (normalizedValue !== this.value) {
        this.$emit('change', normalizedValue);
      }
      return (normalizedValue - from) / (to - from);
    },

    strokeDashOffset(): string {
      return `${ (1 - this.position) * (this as any).circumference }px`;
    },

    strokeWidth(): number {
      return Number(this.width) / +this.size * this.viewBoxSize * 2;
    },

    classes(): object {
      return { 'is-indeterminate': this.indeterminate };
    },

    styles(): object {
      return {
        height        : `${ this.size }px`,
        width         : `${ this.size }px`,
        color         : this.color,
        'caret-color' : this.color,
      };
    },

    svgStyles(): object {
      return {
        transform : `rotate(${ Number(this.rotate) }deg)`,
      };
    },

    viewBoxSize(): number {
      return (this as any).radius / (1 - Number(this.width) / +this.size);
    },
  },

  created() {
    (this as any).radius = 20;
    (this as any).circumference = 2 * Math.PI * (this as any).radius;
    (this as any).strokeDashArray = Math.round((this as any).circumference * 1000) / 1000;
  },

  render() {
    const {
      classes, styles, value, viewBoxSize, indeterminate, radius, strokeWidth, strokeDashArray, strokeDashOffset,
    } = this;

    return (
      <div
        class={[bem(), classes]}
        style={styles}
        on={this.$listeners}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`${ viewBoxSize } ${ viewBoxSize } ${ 2 * viewBoxSize } ${ 2 * viewBoxSize }`}>
          {[0, 1].map((item, index) => {
            if (!indeterminate || index === 2) {
              return (
                  <circle
                    class={index === 1 ? 'underlay' : 'overlay'}
                    key={index}
                    fill='transparent'
                    cx={2 * viewBoxSize}
                    cy={2 * viewBoxSize}
                    r={radius}
                    stroke-width={strokeWidth}
                    stroke-dasharray={strokeDashArray}
                    stroke-dashoffset={index === 1 ? 0 : strokeDashOffset}
                  ></circle>);
            }
            return null;
          })}
        </svg>
      <div class="info">
        {this.slots() ? this.slots : value}
      </div>
    </div>
    );
  },

});
