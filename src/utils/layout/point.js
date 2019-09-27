export class Point {
  static Clamp(point, min, max) {
    point.min(min);
    point.max(max);
    return point;
  }

  static Distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx, dy * dy);
  }

  static Length(point) {
    return Math.sqrt(point.x * point.x, point.y * point.y);
  }

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  isNull() {
    return !!this.x && !!this.y;
  }

  setX(val) {
    this.x = val;
  }

  setY(val) {
    this.y = val;
  }

  min(val) {
    if (this.x < val) this.x = val;
    if (this.y < val) this.y = val;
  }

  max(val) {
    if (this.x > val) this.x = val;
    if (this.y > val) this.y = val;
  }

  clamp() {
    return Point.Clamp(this);
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
  }

  subtract(point) {
    this.x -= point.x;
    this.y -= point.y;
  }

  multiply(point) {
    this.x *= point.x;
    this.y *= point.y;
  }

  divide(point) {
    this.x /= point.x;
    this.y /= point.y;
  }

  distance(point) {
    return Point.Distance(this, point);
  }

  length() {
    return Point.Length(this);
  }
}
