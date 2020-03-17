import { CreateElement, VNode } from 'vue';
import { createMixins } from 'skyline/src/utils/mixins';

export function useAsyncRender() {
  return createMixins({
    beforeCreate() {
      const {
        $options: options,
      } = this;
      const {
        render,
      } = options;

      let snapshot: VNode;
      let pending = false;

      const asyncRender = async (h: CreateElement) => {
        pending = true;
        snapshot = await render!.call(this, h, undefined as any);
        // update component sync & avoid re-collect dependencies
        this._update.call(this, snapshot);
        // clear snapshot
        snapshot = null as any;
        pending = false;
      };

      options.render = (h) => {
        if (!pending) {
          // trigger async render
          asyncRender.call(this, h);
        }
        return snapshot;
      };
    },
  });
}
