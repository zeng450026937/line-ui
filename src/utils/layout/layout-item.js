import { Rect } from './rect';

export class LayoutItem {
  constructor(width, height) {
    this.minWidth = undefined;
    this.maxWidth = undefined;
    this.minHeight = undefined;
    this.maxHeight = undefined;
    this.geometry = new Rect(0, 0, width, height);
    this.layout = null;
    this.valid = false;
    this.previous = null;
    this.next = null;
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

  setGeometry(rect) {
    this.geometry = rect;
  }

  invalidate() {
    this.valid = false;
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
}
