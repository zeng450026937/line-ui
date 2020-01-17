import { createNamespace } from '@/utils/namespace';
import { createColorClasses } from '@/mixins/use-color';
import '@/components/note/note.scss';
import '@/components/note/note.ios.scss';

const [createComponent, bem] = createNamespace('note');

export default createComponent({
  functional : true,

  props : {
    color : String,
  },

  render(h, { props, slots }) {
    return (
      <div class={[bem(), createColorClasses(props.color)]}>
        {slots()}
      </div>
    );
  },
});