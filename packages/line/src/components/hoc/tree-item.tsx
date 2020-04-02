import { createNamespace } from '@line-ui/line/src/utils/namespace';
import { useTreeItem } from '@line-ui/line/src/mixins/use-tree-item';

const { createComponent, bem } = /*#__PURE__*/ createNamespace('tree-item');

export default /*#__PURE__*/ createComponent({
  mixins : [
    /*#__PURE__*/ useTreeItem('Tree'),
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
