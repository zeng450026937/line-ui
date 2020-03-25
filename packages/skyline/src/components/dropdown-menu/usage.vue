  <template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>SKYLINE</line-title>
      </line-toolbar>
    </line-header>
    <line-content>
      <line-dropdown-menu
        ref="menu"
        :columns="columns"
        :trigger="trigger"
        :height="260"
        v-model="visible"
        @colChange="onColChange"
      >
        <!-- <div class="content" style="padding: 10px 0">
          <line-item>
            <line-label>switch</line-label>
            <line-switch color="danger" v-model="switchVal" checked></line-switch>
          </line-item>
          <line-item>
            <line-label>checkbox</line-label>
            <line-check-box color="success" checked></line-check-box>
          </line-item>
          <line-item>
            <line-label>radio</line-label>
            <line-radio color="warning" checked></line-radio>
          </line-item>
          <line-item>
            <line-progress-bar color="success" :value="0.4"></line-progress-bar>
          </line-item>
          <line-button
            color="success"
            size="mini"
            expand="full"
            style="margin-top: 10px"
          >menu button</line-button>
        </div> -->
      </line-dropdown-menu>
      <line-button
        expand="block"
        @click="onClick"
      >Click</line-button>
      <div style="height: 400px;"></div>
      <line-button
        expand="block"
        @click="onClick"
      >Click</line-button>
      <div style="height: 100px;"></div>
    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

const defaultColumnOptions = [
  [
    'Dog',
    'Cat',
    'Bird',
    'Lizard',
    'Chinchilla',
  ],
];

export default Vue.extend({
  data() {
    return {
      columns   : [],
      trigger   : null,
      switchVal : true,
      visible   : false,
    };
  },

  methods : {
    onColChange(data) {
      console.log('onColChange: ', data);
    },

    onClick(event) {
      this.trigger = event && event.target;

      this.visible = !this.visible;
    },

    getColumns(numColumns, numOptions, columnOptions) {
      const columns = [];
      for (let i = 0; i < numColumns; i++) {
        columns.push({
          name    : `col-${ i }`,
          options : this.getColumnOptions(i, numOptions, columnOptions),
        });
      }

      return columns;
    },

    getColumnOptions(columnIndex, numOptions, columnOptions) {
      const options = [];
      for (let i = 0; i < numOptions; i++) {
        options.push({
          text  : columnOptions[columnIndex][i % numOptions],
          value : i,
        });
      }

      return options;
    },
  },

  created() {
    this.columns = this.getColumns(1, 5, defaultColumnOptions);
  },
});
</script>

<style lang="scss" scoped>
</style>
