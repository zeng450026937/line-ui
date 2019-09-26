export class LayoutRect {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.x;
  }

  set left(val) {
    this.x = val;
  }

  get right() {
    return this.x + this.width;
  }

  set right(val) {
    this.width = val - this.x;
  }

  get top() {
    return this.y;
  }

  set top(val) {
    this.y = val;
  }

  get bottom() {
    return this.y + this.height;
  }

  set bottom(val) {
    this.height = val - this.y;
  }

  contains(x, y) {
    return x > this.x && x < this.right && y > this.y && y < this.bottom;
  }

  intersects(item) {
    return this.contains(item.left, item.top)
    || this.contains(item.right, item.top)
    || this.contains(item.left, item.bottom)
    || this.contains(item.right, item.bottom);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  toStyle() {
    const style = {
      left: `${this.x}px`,
      top: `${this.y}px`,
    };
    if (this.width) {
      style.width = `${this.width}px`;
    }
    if (this.height) {
      style.height = `${this.height}px`;
    }
    return style;
  }
}

export class LayoutItem {
  constructor(width, height) {
    this.minWidth = undefined;
    this.maxWidth = undefined;
    this.minHeight = undefined;
    this.maxHeight = undefined;
    this.spacing = 0;
    this.geometry = new LayoutRect(0, 0, width, height);
  }

  get width() {
    return this.geometry.width;
  }

  set width(val) {
    this.geometry.width = val;
  }

  get height() {
    return this.geometry.height;
  }

  set height(val) {
    this.geometry.height = val;
  }

  setSize(width, height) {
    this.geometry.setSize(width, height);
  }

  clone() {
    const item = new LayoutItem();
    item.minWidth = this.minWidth;
    item.maxWidth = this.maxWidth;
    item.minHeight = this.minHeight;
    item.maxHeight = this.maxHeight;
    item.spacing = this.spacing;
    item.geometry.x = this.geometry.x;
    item.geometry.y = this.geometry.y;
    item.geometry.width = this.geometry.width;
    item.geometry.height = this.geometry.height;
    return item;
  }

  toStyle() {
    const style = this.geometry.toStyle();
    if (this.minWidth) {
      style.minWidth = `${this.minWidth}px`;
    }
    if (this.maxWidth) {
      style.maxWidth = `${this.maxWidth}px`;
    }
    if (this.minHeight) {
      style.minHeight = `${this.minHeight}px`;
    }
    if (this.maxHeight) {
      style.maxHeight = `${this.maxHeight}px`;
    }
    return style;
  }
}

export class Layout extends LayoutItem {
  /* eslint-disable class-methods-use-this */
  get count() { return 0; }

  addItem(item) {}

  removeItem(item) {}

  itemAt(index) {}

  takeAt(index) {}
  /* eslint-enable class-methods-use-this */
}

export const Orientation = {
  Horizontal: 0,
  Vertical: 1,
};

export class BoxLayout extends Layout {
  constructor(orientation) {
    super();
    this.orientation = orientation;
    this.items = [];
  }

  get count() {
    return this.items.length;
  }

  get horizontal() {
    return this.orientation === Orientation.Horizontal;
  }

  get vertical() {
    return this.orientation === Orientation.Vertical;
  }

  addItem(item) {
    if (this.count > 0) {
      const lastIndex = this.count - 1;
      const lastItem = this.itemAt(lastIndex);
      item.geometry.left = lastItem.geometry.right;
      item.geometry.top = lastItem.geometry.bottom;
    }

    this.items.push(item);

    this.geometry.width += item.geometry.width;
    this.geometry.height += item.geometry.height;
  }

  removeItem(item) {
    const index = this.items.indexOf(item);

    this.items.splice(index, 1);

    item.geometry.left = 0;
    item.geometry.top = 0;
    
    this.geometry.width -= item.geometry.width;
    this.geometry.height -= item.geometry.height;

    this.update(index);
  }

  insertItem(index, item) {
    if (index > this.count - 1) { 
      throw new Error('Insert index is out of range.');
    }

    this.items.splice(index, 0, item);

    this.geometry.width += item.geometry.width;
    this.geometry.height += item.geometry.height;

    this.update(index);
  }

  itemAt(index) {
    return this.items[index];
  }

  takeAt(index) {
    const item = this.items[index];
    this.removeItem(index);
    return item;
  }

  update(startIndex = 1) {
    if (this.count <= 1) return;

    let index = startIndex;
    let previousItem = this.itemAt(Math.min(0, startIndex - 1));

    while (index < this.count) {
      const item = this.itemAt(index);
      item.geometry.left = previousItem.geometry.right;
      item.geometry.top = previousItem.geometry.bottom;
      previousItem = item;
      index++;
    }
  }

  reset() {
    this.items.length = 0;
    this.geometry = new LayoutRect();
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
