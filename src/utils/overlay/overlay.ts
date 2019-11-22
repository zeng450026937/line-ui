import Vue from 'vue';
import { Overlay } from '@/components/overlay';

const getAppRoot = (doc: Document = document) => {
  return doc.querySelector('[line-app]') || doc.body;
};

let overlay: any
const stack = [] as Array<any>;

class OverlayDelegate {
  overlay?: Vue | null;
  mounted: boolean = false;
  inserted: boolean = false;

  show(parent: Element = getAppRoot()) {
    if (!this.overlay) {
      this.overlay = new (Vue.extend(Overlay))();
      this.overlay.$mount();
      this.mounted = true;
    }
    parent.appendChild(this.overlay.$el);
  }

  hide() {
    if (!this.overlay) return;
    this.overlay.$el.remove();
  }

  destroy() {
    if (!this.overlay) return;
    this.overlay.$destroy();
  }
}

class OverlayController {
  stack: Array<any> = [];

  createOverlay() {
    const overlay = new OverlayDelegate();
    this.stack.push(overlay);
    return overlay;
  }
}
