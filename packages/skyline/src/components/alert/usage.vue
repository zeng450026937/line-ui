<template>
  <div class="alert-usage">
    <line-button
      expand="block"
      @click="open"
    >
      Show Alert
    </line-button>
  </div>
</template>

<script>
import Vue from 'vue';
import { AlertController } from 'skyline/controller/alert';

const controller = new AlertController();

export default Vue.extend({
  methods : {
    open() {
      controller.create({
        header  : 'Alert',
        message : 'Alert successfully',
        buttons : [
          {
            text : 'Disagree',
          },
          {
            text : 'Agree',
          },
        ],
      }).open();
    },
  },
});
</script>

<style lang="scss" scoped>
.alert-usage {
  width: 100%;
  height: 100%;

  padding: 16px;
}
</style>
