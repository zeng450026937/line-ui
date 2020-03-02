import { createNamespace } from 'skyline/utils/namespace';
import { useTreeItem } from 'skyline/mixins/use-tree';

const [createComponent, bem] = createNamespace('tree-item');

export default /*#__PURE__*/ createComponent({
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
