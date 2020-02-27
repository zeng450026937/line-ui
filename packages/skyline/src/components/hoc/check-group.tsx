import { createNamespace } from 'skyline/utils/namespace';
import { useCheckGroupWithModel } from 'skyline/mixins/use-check-group';

const [createComponent, bem] = createNamespace('check-group');

export default createComponent({
  mixins : [
    useCheckGroupWithModel('Group'),
  ],

  render() {
    return (
      <div class={bem()}>
        { this.slots() }
      </div>
    );
  },
});
