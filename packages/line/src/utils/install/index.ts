/* eslint-disable import/extensions */
import Vue, { ComponentOptions, VueConstructor } from 'vue';
import { isFunction } from '@line-ui/line/src/utils/helpers';

type AssertsKey = 'component' | 'directive';
type AssertsPropKey = 'components' | 'directives';

export function createInstall<V extends Vue = Vue>(
  key: AssertsKey
): {
  (constructor?: VueConstructor): void;
  (options: ComponentOptions<V>): void;
};

export function createInstall<V extends Vue = Vue>(key: AssertsKey) {
  const propKey = `${key}s` as AssertsPropKey;
  return function install(
    this: any,
    target: VueConstructor | ComponentOptions<V> = Vue
  ) {
    const { name } = this;
    // constructor
    if (isFunction(target)) {
      (target as VueConstructor)[key](name, this);
      return;
    }
    // should use Object.create() instead of object destruct
    // as Vue may do this, which lead to some properties leave in prototype
    const { [propKey]: asserts } = target;
    target[propKey] = { [name]: this, ...asserts };
  };
}

export const componentInstall = /*#__PURE__*/ createInstall('component');
export const directiveInstall = /*#__PURE__*/ createInstall('directive');
