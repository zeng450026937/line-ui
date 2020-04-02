import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useColor } from '@line-ui/line/src/mixins/use-color';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('progress-bar');

const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

const renderIndeterminate = (h: any) => {
  return ([
    <div class="indeterminate-bar-primary"><span class="progress-indeterminate"></span></div>,
    <div class="indeterminate-bar-secondary"><span class="progress-indeterminate"></span></div>,
  ]);
};

const renderProgress = (h: any, value: number, buffer: number) => {
  const finalValue = clamp(0, value, 1);
  const finalBuffer = clamp(0, buffer, 1);

  return ([
    <div class="progress" style={{ transform: `scaleX(${ finalValue })` }}></div>,
    finalBuffer !== 1 && <div class="buffer-circles"></div>,
    <div class="progress-buffer-bar" style={{ transform: `scaleX(${ finalBuffer })` }}></div>,
  ]);
};


export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useColor(),
  ],

  props : {
    type : {
      type    : String,
      default : 'determinate',
    },
    reversed : Boolean,
    value    : {
      type    : Number,
      default : 0,
    },
    buffer : {
      type    : Number,
      default : 1,
    },
  },

  render(h) {
    const {
      type, value, paused, reversed, buffer,
    } = this;

    return (
      <div
        role="progressbar"
        aria-valuenow={type === 'determinate' ? value : null}
        aria-valuemin="0"
        aria-valuemax="1"
        class={[
          bem(),
          {
            [`progress-bar-${ type }`] : true,
            'progress-paused'          : paused,
            'progress-bar-reversed'    : document.dir === 'rtl' ? !reversed : reversed,
          },
        ]}
      >
      {type === 'indeterminate'
        ? renderIndeterminate(h)
        : renderProgress(h, value, buffer)
      }
      </div>
    );
  },
});
