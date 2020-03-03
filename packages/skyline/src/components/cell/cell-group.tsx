import { createNamespace } from 'skyline/utils/namespace';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('cell-group');

export default /*#__PURE__*/ createComponent({
  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
