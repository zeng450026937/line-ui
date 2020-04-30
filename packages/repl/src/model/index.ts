import Vue from 'vue';
/* eslint-disable-next-line */
import Kom, { Model } from '@line-ui/kom';
import resources from '../resources';

Vue.use(Kom);

export function createModel() {
  const model = new Model();
  model.provide({
    data() {
      this.resources = resources;
      return {};
    },
  });
  return model;
}
