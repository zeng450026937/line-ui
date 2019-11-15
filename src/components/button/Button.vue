<script lang="js">
import Vue from 'vue';
import AbstractButton from './AbstractButton.vue';
import { useGroupItem } from '@/components/group';

const NAMESPACE = 'ButtonGroup';

export default Vue.extend({
  name : 'Button',

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
      // buttonType =
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

  methods : {
    onClick() {
      this.toggle();
    },
  },

  created() {
    this.staticClass += ' button';
  },
});
</script>

<style lang="scss">
.button {
  max-width: 100%;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  line-height: 1;
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  white-space: nowrap;
  user-select: none;
  position: relative;
  outline: 0;
  // border: 1px solid var(--light);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition: 0.1s;
  cursor: pointer;

  .content {
    align-items: center;
    margin: 0 4px;
  }

  &:active {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
  }

  &::after {
    border-radius: 4px;
  }

  &.is--round {
    border-radius: 22px;
  }

  &.is--plain {
    color: #666666;
    background-color: #ffffff;
  }

  &.is--circle {
    padding: 0 10px;
    border-radius: 50%;
    .content {
      margin: 0;
    }
    &::after {
      border-radius: 50%;
    }
  }

  &.is--disabled {
    pointer-events: none;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0.4;
      background-color: #ffffff;
      z-index: 99;
    }
  }

  &.is--default {
    background-color: #ffffff;
    color: #666666;
    &:hover {
      // &:active {
      color: var(--dark);
    }
  }

  &.is--primary {
    background-color: var(--primary);
    border-color: var(--primary);
    color: #ffffff;
    &:hover {
      // &:active {
      background-color: var(--primary-hover);
      border-color: var(--primary-hover);
    }
  }

  &.is--success {
    background-color: var(--success);
    border-color: var(--success);
    color: #ffffff;
    &:hover {
      // &:active {
      background-color: var(--success-hover);
      border-color: var(--success-hover);
    }
  }

  &.is--warning {
    background-color: var(--warning);
    border-color: var(--warning);
    color: #ffffff;
    &:hover {
      // &:active {
      background-color: var(--warning-hover);
      border-color: var(--warning-hover);
    }
  }

  &.is--danger {
    background-color: var(--danger);
    border-color: var(--danger);
    color: #ffffff;
    &:hover {
      // &:active {
      background-color: var(--danger-hover);
      border-color: var(--danger-hover);
    }
  }

  &.is--light {
    background-color: var(--light);
    border-color: var(--light);
    color: #1a1a1a;
    &:hover {
      // &:active {
      background-color: var(--light-hover);
      border-color: var(--light-hover);
    }
  }

  &.is--dark {
    background-color: var(--dark);
    border-color: var(--dark);
    color: #ffffff;
    &:hover {
      // &:active {
      background-color: var(--dark-hover);
      border-color: var(--dark-hover);
    }
  }

  &.is--plain.is--primary {
    background-color: var(--primary-light);
    color: var(--primary);
    &:hover {
      // &:active {
      background-color: var(--primary);
      color: #ffffff;
    }
  }
  &.is--plain.is--success {
    background-color: var(--success-light);
    color: var(--success);
    &:hover {
      // &:active {
      background-color: var(--success);
      color: #ffffff;
    }
  }
  &.is--plain.is--warning {
    background-color: var(--warning-light);
    color: var(--warning);
    &:hover {
      // &:active {
      background-color: var(--warning);
      color: #ffffff;
    }
  }
  &.is--plain.is--danger {
    background-color: var(--danger-light);
    color: var(--danger);
    &:hover {
      // &:active {
      background-color: var(--danger);
      color: #ffffff;
    }
  }
  &.is--plain.is--light {
    background-color: var(--light-light);
    // color: var(--light);
    &:hover {
      // &:active {
      background-color: var(--light);
    }
  }
  &.is--plain.is--dark {
    background-color: var(--dark-light);
    color: var(--dark);
    &:hover {
      // &:active {
      background-color: var(--dark);
      color: #ffffff;
    }
  }
}
</style>
