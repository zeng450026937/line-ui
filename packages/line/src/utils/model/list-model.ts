import { ItemModel } from './item-model';

export class ListModel extends ItemModel {
  constructor(items) {
    super();
    this.reset(items);
  }

  reset(items) {
    this.items = items;
    this.indexs = [];
    this.indexs.length = items.length;
  }

  rowCount() {
    return this.indexs.length;
  }

  columnCount() {
    return 1;
  }

  data(index) {
    if (!index.isValid() || index.row > this.rowCount()) {
      return null;
    }
    return index.data;
  }

  setData(index, val) {
    if (!index.isValid() || index.row > this.rowCount()) {
      return;
    }
    index.setData(val);
  }

  index(row) {
    let index = this.indexs[row];
    if (!index) {
      index = this.indexs[row] = this.createIndex(row, this.items[row]);
    }
    return index;
  }

  createIndex(row, data = null) {
    return super.createIndex(row, 0, data);
  }
}
