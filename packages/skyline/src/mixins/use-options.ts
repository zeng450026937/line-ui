import { createMixins } from 'skyline/src/utils/mixins';

export function useOptions(options: Array<string>, namsespace = 'options') {
  return createMixins({
    props : options.reduce((prev, val) => {
      prev[val] = Boolean;
      return prev;
    }, {
      [namsespace] : {
        type : String,
        validator(val: string) { return options.includes(val); },
      },
    } as Record<string, any>),

    beforeRender() {
      const { $props: props } = this;
      let hit = props[namsespace];
      if (!hit) {
        for (const option of options) {
          hit = props[option] ? option : hit;
          if (hit) break;
        }
      }
      this[namsespace] = hit || options[0];
    },
  });
}
