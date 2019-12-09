import { VueConstructor } from 'vue';
import { RouteConfig } from 'vue-router';

interface Model extends Object {
  default: VueConstructor
}

interface ComponentMap extends Object {
  [key: string]: any;
}

interface NavItem extends Object {
  label: string,
  value: string,
  children?: NavItem[]
}

const registerRoute = ({ list, componentMap, isDemo = false }:
  {list: NavItem[], componentMap: ComponentMap, isDemo: boolean}): RouteConfig[] => {
  const route: RouteConfig[] = [];

  function addRoute(item: NavItem) {
    const { value, label } = item;
    let module: Model;
    if (value) {
      let component;
      if (isDemo) {
        module = componentMap[`./${ value }/demo/index.vue`];
      } else {
        module = componentMap[`./${ value }/readme.md`];
      }

      if (module) {
        component = module.default;
      }

      route.push({
        component,
        name : isDemo ? `demo-${ value }` : value,
        path : isDemo ? `/mobile/${ value }` : `/website/${ value }`,
        meta : { title: label, displayDemo: !isDemo },
      });
    }
  }


  list.forEach((item: NavItem) => {
    item.children!.forEach((child) => {
      addRoute(child);
    });
  });

  return route;
};

export default registerRoute;
