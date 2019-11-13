import Vue from 'vue';
import { createNamespace } from '@/utils/namespace';
import { useModel } from '@/mixins/use-model';
import Overlay from './overlay';

const [createComponent, bem] = createNamespace('popup');

Vue.use(Overlay);

export default createComponent({
  mixins : [useModel('visable')],

  props : {
    global : {
      type    : Boolean,
      default : false,
    },
    closePolicy : {
      type    : Number,
      default : 0,
    },
    dim : {
      type    : Boolean,
      default : false,
    },
    modal : {
      type    : Boolean,
      default : false,
    },
    tappable : {
      type    : Boolean,
      default : true,
    },
  },

  methods : {
    onTap() {
      console.log('onTap');
      this.visable = !this.visable;
    },
  },

  render() {
    return (
      <div
        v-show={this.visable}
        class={bem({
          dim   : this.dim,
          modal : this.modal,
        })}
      >
        <Overlay></Overlay>
        <div class={bem('content')}>
          {this.slots()}
        </div>
      </div>
    );
  },
});
