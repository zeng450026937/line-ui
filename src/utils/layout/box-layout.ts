import { LayoutItem } from './layout-item';
import { Layout } from './layout';

export const enum Orientation {
  Horizontal = 0,
  Vertical = 1,
}

function isNumber(value: any) {
  /* eslint-disable-next-line */
  return !isNaN(parseFloat(value)) && isFinite(value);
}

const DefaultShouldUpdateNext = (...args: unknown[]) => true;

export class BoxLayout extends Layout {
  orientation: Orientation;
  spacing: number;

  constructor(orientation: Orientation) {
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

  addItem(item: LayoutItem): number {
    const index = super.addItem(item);
    this.update(item);
    return index;
  }

  removeItem(item: LayoutItem): number {
    const { next } = item;
    const index = super.removeItem(item);
    this.update(next);
    return index;
  }

  insertItem(index: number, item: LayoutItem) {
    if (index > this.count - 1) {
      throw new Error('Insert index is out of range.');
    }
    const target = this.itemAt(index);
    const { previous, next } = target!;
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

  check() {
    let current = this.itemAt(0);
    while (current && current.next) {
      const { next } = current;
      if (this.horizontal) {
        if (next.geometry.left !== current.geometry.right) {
          debugger;
        }
      }
      if (this.vertical) {
        if (next.geometry.top !== current.geometry.bottom) {
          debugger;
        }
      }
      current = next;
    }

    console.log(`layout all right. count: ${this.count}`, this);
  }

  update(
    item: number | LayoutItem | null,
    shouldUpdateNext = DefaultShouldUpdateNext,
  ) {
    if (isNumber(item)) {
      item = this.itemAt(item as number);
    }
    if (!item) return;

    let current: LayoutItem;

    current = item as LayoutItem;

    if (current && current.previous) {
      const { previous } = current;
      if (this.horizontal) {
        current.geometry.left = previous.geometry.right;
      }
      if (this.vertical) {
        current.geometry.top = previous.geometry.bottom;
      }
    }

    while (current && current.next && shouldUpdateNext(current)) {
      const { next } = current;
      if (this.horizontal) {
        if (next.geometry.left === current.geometry.right) {
          break;
        }
        next.geometry.left = current.geometry.right;
      }
      if (this.vertical) {
        // console.debug(
        //   'update layout \n',
        //   `current top: ${current.geometry.top} \n`,
        //   `current bottom: ${current.geometry.bottom} \n`,
        //   `next top: ${next.geometry.top} \n`,
        //   `next bottom: ${next.geometry.bottom} \n`,
        // );
        if (next.geometry.top === current.geometry.bottom) {
          break;
        }
        next.geometry.top = current.geometry.bottom;
      }
      current = next;
    }

    const last = this.itemAt(this.count - 1)!;
    this.geometry.right = last.geometry.right;
    this.geometry.bottom = last.geometry.bottom;

    // this.check();
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
