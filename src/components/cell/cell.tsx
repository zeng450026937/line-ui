import { Icon } from '@/components/icon';
import { createNamespace } from '@/utils/namespace';
import '@/components/cell/cell.scss';

const [createComponent, bem] = createNamespace('cell');

export default createComponent({
  components : {
    Icon,
  },

  props : {
    title : {
      type    : [String, Number],
      default : '',
    },
    content : {
      type    : [String, Number],
      default : '',
    },
    arrow : {
      type    : Boolean,
      default : false,
    },
  },

  render() {
    const { arrow } = this;

    return (
      <div
        class={bem({ arrow })}
        on={ this.$listeners }
      >
        <div class={bem('title')}>
          { this.slots('title') || this.title }
        </div>
        <div class={bem('content')}>
          { this.slots('content') || this.content }
          {arrow && (
          <span class={bem('arrow')} >
            <icon
              name='chevron_right'
              width="24"
              height="24"
             ></icon>
          </span>)}
        </div>
      </div>
    );
  },

});
