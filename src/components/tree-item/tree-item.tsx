import { createNamespace } from '@/utils/namespace';
import { useTreeItem, useTreeItemWithModel } from '@/mixins/use-tree-item';

const [createComponent, bem] = createNamespace('tree-item');

export default createComponent({
  mixins : [useTreeItemWithModel('Tree')],

  methods : {
    onClick(e: UIEvent) {
      e.stopPropagation();
      this.toggle();
    },
  },

  render() {
    console.warn('render', this.itemIndex, this.checkState, this.modelValue, this.checkedItemValue);
    return (
      <div class={bem()} onClick={this.onClick}>
        { this.slots() }
        { `tree item ${ this.modelValue }: ${ this.checkState }` }
      </div>
    );
  },
});
