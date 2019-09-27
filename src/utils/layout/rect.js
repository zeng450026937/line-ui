import { Point } from './point';
import { Size } from './size';

export class Rect {
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
    this.width = Math.min(0, val - this.x);
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
    this.height = Math.min(0, val - this.y);
  }

  setX(val) {
    this.x = val;
  }

  setY(val) {
    this.y = val;
  }

  setWidth(val) {
    this.width = val;
  } 

  setHeight(val) {
    this.height = val;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
  }

  setRect(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  setCoords(x1, y1, x2, y2) {
    this.left = x1;
    this.top = y1;
    this.right = x2;
    this.bottom = y2;
  }

  topLeft() {
    return new Point(this.left, this.top);
  }

  bottomLeft() {
    return new Point(this.left, this.bottom);
  }

  topRight() {
    return new Point(this.right, this.top);
  }

  bottomRight() {
    return new Point(this.right, this.bottom);
  }

  center() {
    return new Point(
      this.x + Math.ceil(this.width / 2),
      this.y + Math.ceil(this.height / 2),
    );
  }

  size() {
    return new Size(this.width, this.height);
  }

  isEmpty() {
    return !this.isValid();
  }

  isValid() {
    return this.left < this.right || this.top < this.bottom;
  }

  isNull() {
    return !!this.width && !!this.height;
  }

  normailized() {
    if (this.isValid()) return this;
    const x = this.width < 0 ? this.x + this.width : this.x;
    const y = this.height < 0 ? this.y + this.height : this.y;
    return new Rect(x, y, this.width, this.height);
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

  adjust(dx1, dy1, dx2, dy2) {
    this.left += dx1;
    this.top += dy1;
    this.right += dx2;
    this.bottom += dy2;
    return this;
  }

  adjusted(dx1, dy1, dx2, dy2) {
    const adjusted = new Rect(this.x, this.y, this.width, this.height);
    adjusted.adjust(dx1, dy1, dx2, dy2);
    return adjusted;
  }

  moveTop(y) {
    this.y = y;
    return this;
  }

  moveBottom(y) {
    const dy = y - this.bottom;
    this.y += dy;
    return this;
  }

  moveLeft(x) {
    this.x = x;
    return this;
  }

  moveRight(x) {
    const dx = x - this.right;
    this.x += dx;
    return this;
  }

  moveCenter(point) {
    this.x = point.x - Math.ceil(this.width / 2);
    this.y = point.y - Math.ceil(this.height / 2);
    return this;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  translate(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  translated(point) {
    return new Rect(
      this.x += point.x,
      this.y += point.y,
      this.width,
      this.height,
    );
  }

  united(rect) {
    return new Rect(
      Math.min(this.x, rect.x),
      Math.min(this.y, rect.y),
      Math.max(this.width, rect.width),
      Math.max(this.height, rect.height),
    );
  }

  intersected(rect) {
    return new Rect(
      Math.max(this.x, rect.x),
      Math.max(this.y, rect.y),
      Math.min(this.width, rect.width),
      Math.min(this.height, rect.height),
    );
  }
}
