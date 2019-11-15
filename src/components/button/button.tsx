import { createNamespace } from '@/utils/namespace';
import AbstractButton from '@/components/button/abstract-button';
import { useGroupItem } from '@/components/group';
import '@/components/button/button.scss';

const NAMESPACE = 'ButtonGroup';
const [createComponent, bem] = createNamespace('button');

export default createComponent({
  mixins : [useGroupItem(NAMESPACE)],

  extends : AbstractButton,

  props : {
    flat : {
      type    : Boolean,
      default : false,
    },
    highlighted : {
      type    : Boolean,
      default : false,
    },
    type : {
      type    : String,
      default : 'default', // primary success warning danger light dark
    },
    plain : {
      type    : Boolean,
      default : false,
    },
    round : {
      type    : Boolean,
      default : false,
    },
    circle : {
      type    : Boolean,
      default : false,
    },
    loading : {
      type    : Boolean,
      default : false,
    },
    size : {
      type    : String,
      default : 'normal',
    },
    disabled : {
      type    : Boolean,
      default : false,
    },
  },

  computed : {
    class() {
      const {
        round,
        plain,
        circle,
        disabled,
        loading,
        type,
        size,
      } = this;
      return {
        'is--round'       : round,
        'is--plain'       : plain,
        'is--circle'      : circle,
        'is--disabled'    : disabled,
        'is--loading'     : loading,
        [`is--${ type }`] : type,
        [`is--${ size }`] : size,
      };
    },
  },

  created() {
    this.staticClass += ' line-button';
  },

  methods : {
    onClick() {
      this.toggle();
    },
  },

});
