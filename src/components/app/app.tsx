import { createNamespace } from '@/utils/namespace';

const [createComponent, bem] = createNamespace('app');

export default createComponent({
  provide() {
    return {
      App : this,
    };
  },

  render() {
    return (
      <div class={bem()}></div>
    );
  },
});
