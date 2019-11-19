import { createMixins } from '@/utils/mixins';

export function useOptions(options: Array<string>, namsespace: string = 'options') {
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

    beforeRender(ctx) {
      const { props } = ctx;
      let hit = props[namsespace];
      if (!hit) {
        for (const option of options) {
          hit = props[option] ? option : hit;
          if (hit) break;
        }
      }
      ctx[namsespace] = hit;
    },
  });
}
