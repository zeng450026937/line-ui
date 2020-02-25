import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('cell-group');

export default createComponent({
  render() {
    return (
      <div class={bem()}>
        {this.slots()}
      </div>
    );
  },
});
