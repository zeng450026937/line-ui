<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Grid</line-title>
      </line-toolbar>
    </line-header>

    <line-content>
      <line-grid>
        <line-row>
          <line-col>
            <div>1 of 2</div>
          </line-col>
          <line-col>
            <div>2 of 2</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col>
            <div>1 of 3</div>
          </line-col>
          <line-col>
            <div>2 of 3</div>
          </line-col>
          <line-col>
            <div>3 of 3</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col>
            <div>1 of 3</div>
          </line-col>
          <line-col col-6>
            <div>2 of 3</div>
          </line-col>
          <line-col>
            <div>3 of 3</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col col-6>
            <div>1 of 3</div>
          </line-col>
          <line-col>
            <div>2 of 3</div>
          </line-col>
          <line-col>
            <div>3 of 3</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col offset-4>
            <div>1 of 2</div>
          </line-col>
          <line-col>
            <div>2 of 2</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col>
            <div>1 of 2</div>
          </line-col>
          <line-col offset-4>
            <div>2 of 2</div>
          </line-col>
        </line-row>
        <line-row>
          <line-col>
            <div>1 of 4</div>
          </line-col>
          <line-col>
            <div>2 of 4</div>
          </line-col>
          <line-col>
            <div>3 of 4</div>
          </line-col>
          <line-col>
            <div>4 of 4</div>
          </line-col>
        </line-row>
      </line-grid>
    </line-content>
  </line-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style lang="scss" scoped>
.line-col > div {
  padding: 10px;

  border: solid 1px #ddd;

  background-color: #f7f7f7;
}
</style>
