<template>
  <line-content class="line-padding">
    <line-list>
      <line-item>
        <line-label>Start Date</line-label>
        <line-datetime
          v-model="startDate"
          placeholder="DateTime"
        ></line-datetime>
      </line-item>
      <line-item>
        <line-label>Start Time</line-label>
        <line-datetime
          display-format="h:mm A"
          picker-format="h:mm A"
          v-model="startTime"
        ></line-datetime>
      </line-item>
      <line-item>
        <line-label>Ends</line-label>
        <line-datetime
          v-model="endDate"
          placeholder="Select Date"
        ></line-datetime>
      </line-item>
    </line-list>
  </line-content>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      visible   : false,
      startDate : '1990-02-19',
      startTime : '1990-02-19T07:43Z',
      endDate   : '1990-02-20',
    };
  },

  computed : {

  },

  methods : {
    onClick() {
      const { datetime } = this.$refs;

      console.log(datetime);
      datetime.open();
    },
  },

  watch : {
    value(val) {
      console.log('value', val);
    },
  },
});
</script>

<style lang="scss" scoped>
</style>
