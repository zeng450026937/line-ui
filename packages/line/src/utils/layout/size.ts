export const enum AspectRatioMode {
  IgnoreAspectRatio = 0,
  KeepAspectRatio = 1,
  KeepAspectRatioByExpanding = 2,
}

export class Size {
  width: number;
  height: number;

  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }

  isEmpty() {
    return this.width <= 0 || this.height <= 0;
  }

  isNull() {
    return !!this.width && !!this.height;
  }

  isValid() {
    return this.width >= 0 && this.height >= 0;
  }

  scale(
    width: number,
    height: number,
    mode: AspectRatioMode = AspectRatioMode.IgnoreAspectRatio
  ) {
    const ratio = this.width / this.height;
    switch (mode) {
      case AspectRatioMode.KeepAspectRatio:
        this.width = ratio > 1 ? width : width * ratio;
        this.height = ratio > 1 ? height * ratio : height;
        break;
      case AspectRatioMode.KeepAspectRatioByExpanding:
        this.width = ratio > 1 ? width * ratio : width;
        this.height = ratio > 1 ? height : height * ratio;
        break;
      case AspectRatioMode.IgnoreAspectRatio:
      default:
        this.width = width;
        this.height = height;
        break;
    }
    return this;
  }

  scaled(
    width: number,
    height: number,
    mode = AspectRatioMode.IgnoreAspectRatio
  ) {
    const scaled = new Size(this.width, this.height);
    scaled.scale(width, height, mode);
    return scaled;
  }

  setWidth(val: number) {
    this.width = val;
  }

  setHeight(val: number) {
    this.height = val;
  }

  transpose() {
    // Swaps the width and height values.
    ({ width: this.height, height: this.width } = this);
  }

  add(size: Size) {
    this.width += size.width;
    this.height += size.height;
  }

  subtract(size: Size) {
    this.width -= size.width;
    this.height -= size.height;
  }

  multiply(factor: number) {
    this.width *= factor;
    this.height *= factor;
  }

  divide(divisor: number) {
    this.width /= divisor;
    this.height /= divisor;
  }
}
