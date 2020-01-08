import { createMixins } from '@/utils/mixins';
import { isString } from '@/utils/helpers';

// TODO:
// remove color validator
const COLORS = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'light',
  'medium',
  'dark',
];

export function createColorClasses(color: string) {
  if (!isString(color) || !color) return undefined;
  return {
    'line-color'              : true,
    [`line-color-${ color }`] : true,
  };
}

export function getClassList(color?: Record<string, any>) {
  if (!color) return [];
  return Object.keys(color).filter(c => !!color[c]);
}

export function useColor() {
  return createMixins({
    props : {
      /**
       * The color to use from your application's color palette.
       * Default options are:
       * `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`,
       * `"light"`, `"medium"`, and `"dark"`.
      */
      color : {
        type : String,
        validator(val) {
          return COLORS.includes(val);
        },
      },
    },

    afterRender(vnode) {
      if (!vnode || !vnode.data) return;
      if (!isString(this.color) || !this.color) return;
      const colorClasses = getClassList(createColorClasses(this.color));
      vnode.data.staticClass = `${ vnode.data.staticClass || '' } ${ colorClasses.join(' ') } `.trim();
    },
  });
}
