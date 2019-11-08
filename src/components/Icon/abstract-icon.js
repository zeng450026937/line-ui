import Vue from 'vue';

export default Vue.extend({
  props : {
    name : {
      type    : String,
      default : '',
    },
    source : {
      type    : String,
      default : '',
    },
    width : {
      type    : [Number, String],
      default : 24,
    },
    height : {
      type    : [Number, String],
      default : 24,
    },
    color : {
      type    : String,
      default : '',
    },
  },
});
