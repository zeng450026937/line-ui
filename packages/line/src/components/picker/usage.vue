<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Picker</line-title>
      </line-toolbar>
    </line-header>

    <line-content class="line-padding">
      <line-picker :columns="columns" :buttons="buttons" v-model="visible">
      </line-picker>
      <line-button expand="block" @click="onClick()"
        >Show Single Column Picker</line-button
      >
      <line-button expand="block" @click="onClick(2, 5, multiColumnOptions)"
        >Show Multi Column Picker</line-button
      >
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

const defaultColumnOptions = [['Dog', 'Cat', 'Bird', 'Lizard', 'Chinchilla']];

const multiColumnOptions = [
  ['Minified', 'Responsive', 'Full Stack', 'Mobile First', 'Serverless'],
  ['Tomato', 'Avocado', 'Onion', 'Potato', 'Artichoke'],
];

export default Vue.extend({
  data() {
    return {
      visible: false,
      columns: [],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.value = value;
            console.log('Got Value:', this.value);
          },
        },
      ],
    };
  },

  computed: {
    multiColumnOptions() {
      return multiColumnOptions;
    },
  },

  methods: {
    onClick(
      numColumns = 1,
      numOptions = 5,
      columnOptions = defaultColumnOptions
    ) {
      this.columns = this.getColumns(numColumns, numOptions, columnOptions);
      this.visible = !this.visible;
    },

    getColumns(numColumns, numOptions, columnOptions) {
      const columns = [];
      for (let i = 0; i < numColumns; i++) {
        columns.push({
          name: `col-${i}`,
          options: this.getColumnOptions(i, numOptions, columnOptions),
        });
      }

      return columns;
    },

    getColumnOptions(columnIndex, numOptions, columnOptions) {
      const options = [];
      for (let i = 0; i < numOptions; i++) {
        options.push({
          text: columnOptions[columnIndex][i % numOptions],
          value: i,
        });
      }

      return options;
    },
  },
});
</script>

<style lang="scss" scoped></style>
