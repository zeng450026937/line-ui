import usages from './usages';

const createReadmeLoader = (name: keyof typeof usages) => {
  const load = async () => {
    const item = await import(
      /* webpackChunkName: "readme/[index]" */
      `!!../string-loader/index.js!../../line/src/components/${name}/readme.md`
    );
    return item.default;
  };
  return {
    name,
    load,
  };
};

const createUsageLoader = (name: keyof typeof usages) => {
  const keys = usages[name];
  const load = async (key: string = 'index') => {
    const item = await import(
      /* webpackChunkName: "usage/[index]" */
      `!!../string-loader/index.js!../../line/src/components/${name}/usage/${key}.vue`
    );
    return item.default;
  };
  return {
    name,
    keys,
    load,
  };
};

const keys = <T extends Record<string, any>>(o: T) => {
  return Object.keys(o) as (keyof T)[];
};

export default keys(usages).map((name) => ({
  name,
  readme: createReadmeLoader(name),
  usage: createUsageLoader(name),
}));
