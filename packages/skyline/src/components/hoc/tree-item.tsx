import { createNamespace } from 'skyline/src/utils/namespace';
import { useTreeItem } from 'skyline/src/mixins/use-tree-item';

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
