import { createNamespace } from 'skyline/utils/namespace';

const [createComponent, bem] = createNamespace('cell-group');

export default /*#__PURE__*/ createComponent({
  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
