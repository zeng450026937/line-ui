import { LayoutItem } from './layout-item';
import { Layout } from './layout';

export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

function isNumber(value) {
  /* eslint-disable-next-line */
  return !isNaN(parseFloat(value)) && Math.isFinite(value);
}

const DefaultShouldUpdatePrevious = () => true;
const DefaultShouldUpdateNext = () => true;

export class BoxLayout extends Layout {
  constructor(orientation) {
    super();
    this.orientation = orientation;
    this.spacing = 0;
  }

  get horizontal() {
    return this.orientation === Orientation.Horizontal;
  }

  get vertical() {
    return this.orientation === Orientation.Vertical;
  }

  addItem(item) {
    super.addItem(item);
    this.update(item);
  }

  removeItem(item) {
    const { next } = item;
    super.removeItem(item);
    this.update(next);
  }

  insertItem(index, item) {
    if (index > this.count - 1) { 
      throw new Error('Insert index is out of range.');
    }
    const target = this.itemAt(index);
    const { previous, next } = target;
    if (previous) {
      previous.next = item;
    }
    if (next) {
      next.previous = item;
    }
    item.previous = previous;
    item.next = next;
    this.items.splice(index, 0, item);
    this.update(item);
  }

  update(
    item,
    shouldUpdatePrevious = DefaultShouldUpdatePrevious,
    shouldUpdateNext = DefaultShouldUpdateNext,
  ) {
    if (!item) return;

    if (isNumber(item)) {
      item = this.itemAt(item);
    }
    
    let current;

    current = item;
    while (current && current.previous && shouldUpdatePrevious(current)) {
      const { previous } = current;
      if (this.horizontal) {
        if (current.geometry.left === previous.geometry.right) {
          break;
        }
        current.geometry.left = previous.geometry.right;
      }
      if (this.vertical) {
        if (current.geometry.top === previous.geometry.bottom) {
          break;
        }
        current.geometry.top = previous.geometry.bottom;
      }
      current = previous;
    }

    current = item;
    while (current && current.next && shouldUpdateNext(current)) {
      const { next } = current;
      if (this.horizontal) {
        if (next.geometry.left === current.geometry.right) {
          break;
        }
        next.geometry.left = current.geometry.right;
      }
      if (this.vertical) {
        if (next.geometry.top === current.geometry.bottom) {
          break;
        }
        next.geometry.top = current.geometry.bottom;
      }
      current = next;
    }

    const last = this.itemAt(this.count - 1);
    this.geometry.right = last.geometry.right;
    this.geometry.bottom = last.geometry.bottom;
  }
}

export class HBoxLayout extends BoxLayout {
  constructor() {
    super(Orientation.Horizontal);
  }
}

export class VBoxLayout extends BoxLayout {
  constructor() {
    super(Orientation.Vertical);
  }
}
