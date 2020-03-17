import { CreateElement } from 'vue';
import { createNamespace } from 'skyline/src/utils/namespace';
import { createColorClasses } from 'skyline/src/mixins/use-color';
import {
  config,
  getSkylineMode,
} from 'skyline/src/utils/config';
import {
  SpinnerConfig,
  SPINNERS,
  SpinnerTypes,
} from 'skyline/src/components/spinner/spinner-configs';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('spinner');

function getSpinnerName(name?: string): SpinnerTypes {
  const spinnerName = name || config.get('spinner');
  const mode = getSkylineMode();
  if (spinnerName) {
    return spinnerName;
  }
  return (mode === 'ios') ? 'lines' : 'circular';
}

function buildCircle(h: CreateElement, spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${ duration }ms`;

  return (
    <svg viewBox={data.viewBox || '0 0 64 64'} style={data.style}>
      <circle
        transform={data.transform || 'translate(32,32)'}
        cx={data.cx}
        cy={data.cy}
        r={data.r}
        style={spinner.elmDuration ? { animationDuration: `${ duration }ms` } : {}}
      />
    </svg>
  );
}

function buildLine(h: CreateElement, spinner: SpinnerConfig, duration: number, index: number, total: number) {
  const data = spinner.fn(duration, index, total);
  data.style['animation-duration'] = `${ duration }ms`;

  return (
    <svg viewBox={data.viewBox || '0 0 64 64'} style={data.style}>
      <line transform="translate(32,32)" y1={data.y1} y2={data.y2}></line>
    </svg>
  );
}

export default /*#__PURE__*/ createComponent({
  functional : true,

  props : {
    color    : String,
    duration : Number,
    type     : String,
    paused   : Boolean,
  },

  render(h, { props, data }) {
    const spinnerName = getSpinnerName(props.type);
    const spinner = SPINNERS[spinnerName] || SPINNERS.lines;
    const duration = (props.duration > 10 ? props.duration : spinner.dur);
    const svgs: any[] = [];

    if (spinner.circles !== undefined) {
      for (let i = 0; i < spinner.circles; i++) {
        svgs.push(buildCircle(h, spinner, duration, i, spinner.circles));
      }
    } else if (spinner.lines !== undefined) {
      for (let i = 0; i < spinner.lines; i++) {
        svgs.push(buildLine(h, spinner, duration, i, spinner.lines));
      }
    }
    return (
      <div
        class={[
          bem({
            [spinnerName] : true,
            paused        : !!props.paused || config.getBoolean('testing'),
          }),
          createColorClasses(props.color),
        ]}
        role="progressbar"
        style={spinner.elmDuration && { animationDuration: `${ duration }ms` }}
        {...data}
      >
        {svgs}
      </div>
    );
  },
});
