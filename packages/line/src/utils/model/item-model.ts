import { EventEmitter } from 'events';

export class ModelIndex {
  constructor(model, parent, data) {
    this.row = -1;
    this.column = -1;
    this.model = model;
    this.parent = parent;
    this.data = data;
    this.dirty = false;
  }

  setRow(val) {
    this.row = val;
  }

  setColumn(val) {
    this.column = val;
  }

  setData(val) {
    this.data = val;
    if (this.data !== val) {
      this.dirty = true;
    }
  }

  isValid() {
    return !!this.model && this.row > 0 && this.column > 0;
  }

  toString() {
    return `${this.row}:${this.column}`;
  }
}

export class ItemModel extends EventEmitter {
  rowCount(parent = null) {
    return 0;
  }

  columnCount(parent = null) {
    return 0;
  }

  data(index) {
    return null;
  }

  setData(index, val) {}

  parent(index) {
    return null;
  }

  hasChildren(index) {
    return false;
  }

  hasIndex(row, column, parent = null) {
    return false;
  }

  index(row, column, parent = null) {
    return new ModelIndex();
  }

  insertColum(column, parent) {}

  insertColums(column, count, parent) {}

  insertRow(row, parent) {}

  insertRows(row, count, parent) {}

  removeColum(column, parent) {}

  removeColums(column, count, parent) {}

  removeRow(row, parent) {}

  removeRows(row, count, parent) {}

  sort(column, order) {}

  canFetchMore() {
    return false;
  }

  fetchMore() {}

  revert() {}

  submit() {}

  createIndex(row, column = 0, data = null) {
    return new ModelIndex(this, null, data);
  }
}
