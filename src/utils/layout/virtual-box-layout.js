import { BoxLayout } from './box-layout';

export class VirtualBoxLayout extends BoxLayout {
  constructor(orientation) {
    super(orientation);
    this.from = 0;
    this.to = 0;
  }

  setFrom(val) {
    this.from = val;
  }

  setTo(val) {
    this.to = val;
  }

  update(item) {
    super.update(
      item,
      // current => current === this.itemAt(this.from),
      // current => this.to && current === this.itemAt(this.to),
    );
  }
}
