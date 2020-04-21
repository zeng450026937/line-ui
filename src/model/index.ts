import Vue from 'vue';
/* eslint-disable-next-line */
import Kom, { Model } from '@line-ui/kom';

Vue.use(Kom);

export function createModel() {
  const model = new Model();
  return model;
}
