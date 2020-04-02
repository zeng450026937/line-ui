<template>
  <line-app>
    <line-header translucent>
      <line-toolbar>
        <line-title>Segment</line-title>
      </line-toolbar>
    </line-header>
    <line-content class="line-padding">
      <line-segment v-model="labelValue">
        <line-segment-button modelValue="call">
          <line-label>Call</line-label>
        </line-segment-button>
        <line-segment-button modelValue="favorite">
          <line-label>Favorite</line-label>
        </line-segment-button>
        <line-segment-button modelValue="map">
          <line-label>Map</line-label>
        </line-segment-button>
      </line-segment>

      <!-- Icon only -->
      <line-segment
        v-model="iconValue"
        color="secondary"
      >
        <line-segment-button modelValue="call">
          <line-icon name="call"></line-icon>
        </line-segment-button>
        <line-segment-button modelValue="favorite">
          <line-icon name="favorite"></line-icon>
        </line-segment-button>
        <line-segment-button modelValue="map">
          <line-icon name="map"></line-icon>
        </line-segment-button>
      </line-segment>

      <!-- Icon top -->
      <line-segment
        v-model="iconTopValue"
        color="tertiary"
      >
        <line-segment-button modelValue="call">
          <line-label>Call</line-label>
          <line-icon name="call"></line-icon>
        </line-segment-button>
        <line-segment-button modelValue="favorite">
          <line-label>Favorite</line-label>
          <line-icon name="favorite"></line-icon>
        </line-segment-button>
        <line-segment-button modelValue="map">
          <line-label>Map</line-label>
          <line-icon name="map"></line-icon>
        </line-segment-button>
      </line-segment>

      <line-segment
        v-model="colorValue"
        color="success"
      >
        <line-segment-button
          modelValue="call"
          layout="icon-bottom"
        >
          <line-icon name="call"></line-icon>
          <line-label>Call</line-label>
        </line-segment-button>
        <line-segment-button
          modelValue="favorite"
          layout="icon-bottom"
        >
          <line-icon name="favorite"></line-icon>
          <line-label>Favorite</line-label>
        </line-segment-button>
        <line-segment-button
          modelValue="map"
          layout="icon-bottom"
        >
          <line-icon name="map"></line-icon>
          <line-label>Map</line-label>
        </line-segment-button>
      </line-segment>

    </line-content>
  </line-app>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      value        : 'call',
      iconValue    : 'call',
      labelValue   : 'favorite',
      iconTopValue : 'favorite',
      colorValue   : 'map',
    };
  },

  watch : {
    value(val, oldVal) {
      console.log(val, oldVal);
    },
  },
});
</script>

<style lang="scss" scoped>
.line-segment {
  margin: 15px 0;
}
</style>
