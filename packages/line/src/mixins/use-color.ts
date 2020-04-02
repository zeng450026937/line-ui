import { createMixins } from '@line-ui/line/src/utils/mixins';
import { renderClass } from '@line-ui/line/src/utils/vnode';

export function createColorClasses(color: string) {
  if (!color) return undefined;
  return {
    'line-color'              : true,
    [`line-color-${ color }`] : true,
  };
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
      color : String,
    },

    afterRender(vnode) {
      if (!vnode || !vnode.data) return;
      if (!this.color) return;
      vnode.data.staticClass = renderClass(
        vnode.data.staticClass,
        createColorClasses(this.color),
      );
    },
  });
}
