import {
  isArray,
  isDef,
  isObject,
  isString,
} from 'skyline/src/utils/helpers';

export const mergeClass = (exist?: any, value?: any) => {
  if (!value) return exist;
  if (!exist) return value;
  return [exist, value];
};

export const mergeStaticClass = (exist?: string, value?: string) => {
  return exist
    ? value
      ? (`${ exist } ${ value }`)
      : exist
    : (value || '');
};

export const renderClass = (
  staticClass?: string,
  dynamicClass?: any,
): string => {
  if (!isDef(staticClass) && !isDef(dynamicClass)) return '';
  return mergeStaticClass(staticClass, stringifyClass(dynamicClass));
};

export const stringifyClass = (value: any): string => {
  if (isArray(value)) {
    return stringifyArray(value);
  }
  if (isObject(value)) {
    return stringifyObject(value);
  }
  if (isString(value)) {
    return value;
  }
  /* istanbul ignore next */
  return '';
};

function stringifyArray(value: Array<any>): string {
  let res = '';
  let stringified;

  for (let i = 0, l = value.length; i < l; i++) {
    stringified = stringifyClass(value[i]);

    if (isDef(stringified) && stringified !== '') {
      if (res) res += ' ';
      res += stringified;
    }
  }
  return res;
}

function stringifyObject(value: Record<string, any>): string {
  let res = '';

  for (const key in value) {
    if (value[key]) {
      if (res) res += ' ';
      res += key;
    }
  }
  return res;
}
