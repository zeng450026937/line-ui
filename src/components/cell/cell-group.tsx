import { createNamespace } from '@/utils/namespace';
import '@/components/cell/cell-group.scss';

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
