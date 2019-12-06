import { createNamespace } from '@/utils/namespace';
import { useTreeItem } from '@/mixins/use-tree';

const [createComponent, bem] = createNamespace('tree-item');

export default createComponent({
  mixins : [
    useTreeItem('Tree'),
  ],

  methods : {
    onClick(e: UIEvent) {
      e.stopPropagation();
      this.toggle();
    },
  },

  render() {
    return (
      <div class={bem()} onClick={this.onClick}>
        { this.slots() }
      </div>
    );
  },
});
