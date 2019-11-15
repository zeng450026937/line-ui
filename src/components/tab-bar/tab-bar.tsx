import { createNamespace } from '@/utils/namespace';
import { useGroup } from '@/components/group';
import '@/components/tab-bar/tab-bar.scss';

export const Position = {
  Header : 0,
  Footer : 1,
};
const NAMESPACE = 'TabBar';
const [createComponent, bem] = createNamespace('tab-bar');

export default createComponent({
  mixins : [useGroup(NAMESPACE)],

  props : {
    contentHeight : {
      type    : Number,
      default : 0,
    },
    contentWidth : {
      type    : Number,
      default : 0,
    },
    position : {
      type    : Number,
      default : 0,
    },
    exclusive : {
      type    : Boolean,
      default : true,
    },
  },

  render() {
    const { position } = this;

    return (
      <div class={bem({
        header : position === 0,
        footer : position === 1,
      })}>
      {this.slots()}
      </div>
    );
  },
});
