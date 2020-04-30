<template>
  <div class="console-table">
    <table>
      <thead>
        <tr>
          <template v-for="column in columnsToRender">
            <th :key="column">{{ column }}</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <template v-for="key in keys">
          <tr :key="key">
            <template v-for="column in columnsToRender">
              <td :key="column" v-if="column === INDEX_KEY">{key}</td>
              <td :key="column" v-else-if="column === VALUE_KEY">
                <JSONNode :value="data[key]"></JSONNode>
              </td>
              <td :key="column" v-else-if="column in data[key]">
                <JSONNode :value="data[key][column]"></JSONNode>
              </td>
              <td :key="column" v-else></td>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

const INDEX_KEY = '(index)';
const VALUE_KEY = 'Value';

function getColumnsToRender(data, keys) {
  const columns = new Set([INDEX_KEY]);
  for (const key of keys) {
    const value = data[key];
    if (typeof value === 'object') {
      Object.keys(value).forEach((key) => columns.add(key));
    } else {
      columns.add(VALUE_KEY);
    }
  }
  return [...columns];
}

export default Vue.extend({
  props: {
    data: String,
    colomns: Array,
  },

  data() {
    return {
      INDEX_KEY,
      VALUE_KEY,
    };
  },

  computed: {
    keys() {
      return Object.keys(this.data);
    },
    columnsToRender() {
      return this.colomns || getColumnsToRender(this.data, this.keys);
    },
  },
});
</script>

<style lang="scss" scoped></style>
