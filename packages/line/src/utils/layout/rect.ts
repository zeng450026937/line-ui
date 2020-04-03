import { Point } from './point';
import { Size } from './size';

export class Rect {
  x: number;
  y: number;
  width: number;
  height: number;

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
    this.width = Math.max(0, val - this.x);
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
    this.height = Math.max(0, val - this.y);
  }

  setX(val: number) {
    this.x = val;
  }

  setY(val: number) {
    this.y = val;
  }

  setWidth(val: number) {
    this.width = val;
  }

  setHeight(val: number) {
    this.height = val;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setRect(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  setCoords(x1: number, y1: number, x2: number, y2: number) {
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
      this.y + Math.ceil(this.height / 2)
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

  contains(x: number, y: number) {
    return x > this.x && x < this.right && y > this.y && y < this.bottom;
  }

  intersects(rect: Rect) {
    return (
      this.contains(rect.left, rect.top) ||
      this.contains(rect.right, rect.top) ||
      this.contains(rect.left, rect.bottom) ||
      this.contains(rect.right, rect.bottom)
    );
  }

  adjust(dx1: number, dy1: number, dx2: number, dy2: number) {
    this.left += dx1;
    this.top += dy1;
    this.right += dx2;
    this.bottom += dy2;
    return this;
  }

  adjusted(dx1: number, dy1: number, dx2: number, dy2: number) {
    const adjusted = new Rect(this.x, this.y, this.width, this.height);
    adjusted.adjust(dx1, dy1, dx2, dy2);
    return adjusted;
  }

  moveTop(y: number) {
    this.y = y;
    return this;
  }

  moveBottom(y: number) {
    const dy = y - this.bottom;
    this.y += dy;
    return this;
  }

  moveLeft(x: number) {
    this.x = x;
    return this;
  }

  moveRight(x: number) {
    const dx = x - this.right;
    this.x += dx;
    return this;
  }

  moveCenter(point: Point) {
    this.x = point.x - Math.ceil(this.width / 2);
    this.y = point.y - Math.ceil(this.height / 2);
    return this;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  translate(point: Point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  translated(point: Point) {
    return new Rect(
      (this.x += point.x),
      (this.y += point.y),
      this.width,
      this.height
    );
  }

  united(rect: Rect) {
    return new Rect(
      Math.min(this.x, rect.x),
      Math.min(this.y, rect.y),
      Math.max(this.width, rect.width),
      Math.max(this.height, rect.height)
    );
  }

  intersected(rect: Rect) {
    return new Rect(
      Math.max(this.x, rect.x),
      Math.max(this.y, rect.y),
      Math.min(this.width, rect.width),
      Math.min(this.height, rect.height)
    );
  }
}
