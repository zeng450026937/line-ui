export class Point {
  static Clamp(point: Point, min: number, max: number) {
    point.min(min);
    point.max(max);
    return point;
  }

  static Distance(a: Point, b: Point) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static Length(point: Point) {
    return Math.sqrt(point.x * point.x + point.y * point.y);
  }

  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  isNull() {
    return !!this.x && !!this.y;
  }

  setX(val: number) {
    this.x = val;
  }

  setY(val: number) {
    this.y = val;
  }

  min(val: number) {
    if (this.x < val) this.x = val;
    if (this.y < val) this.y = val;
  }

  max(val: number) {
    if (this.x > val) this.x = val;
    if (this.y > val) this.y = val;
  }

  clamp(min: number, max: number) {
    return Point.Clamp(this, min, max);
  }

  add(point: Point) {
    this.x += point.x;
    this.y += point.y;
  }

  subtract(point: Point) {
    this.x -= point.x;
    this.y -= point.y;
  }

  multiply(point: Point) {
    this.x *= point.x;
    this.y *= point.y;
  }

  divide(point: Point) {
    this.x /= point.x;
    this.y /= point.y;
  }

  distance(point: Point) {
    return Point.Distance(this, point);
  }

  length() {
    return Point.Length(this);
  }
}
